import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "../../models/User";

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function checkAdmin(session) {
  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await User.findOne({ email: session.user.email });
  console.log("Admin check - User found:", user?.email, "admin:", user?.admin);
  
  if (!user || !user.admin) {
    throw new Error("Forbidden");
  }
  return session;
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    console.log("PUT - Session:", session?.user?.email);
    
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const data = await req.json();
    console.log("PUT - Request data:", JSON.stringify(data));
    
    const { _id } = data;
    const admin = data.admin;
    const isVerified = data.isVerified;

    if (_id) {
      console.log("PUT - Updating user with _id:", _id);
      console.log("PUT - admin in payload:", admin, "isVerified in payload:", isVerified);
      
      // Get current user to check if sensitive fields actually changed
      const currentUser = await User.findById(_id);
      if (!currentUser) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
        });
      }

      // Check if admin or isVerified keys exist in data (not just if they have values)
      const hasAdminInData = 'admin' in data;
      const hasIsVerifiedInData = 'isVerified' in data;
      
      // Check if trying to update admin or isVerified fields (and they're actually different)
      const adminChanged = hasAdminInData && admin !== currentUser.admin;
      const verifiedChanged = hasIsVerifiedInData && isVerified !== currentUser.isVerified;
      const isSensitiveUpdate = adminChanged || verifiedChanged;

      console.log("PUT - hasAdminInData:", hasAdminInData, "hasIsVerifiedInData:", hasIsVerifiedInData);
      console.log("PUT - admin changed:", adminChanged, "verified changed:", verifiedChanged);

      if (isSensitiveUpdate) {
        console.log("PUT - Attempting to update sensitive fields, checking admin status...");
        // Only admins can update admin or isVerified
        await checkAdmin(session);
        console.log("PUT - Admin check passed");
      }

      // Prepare all update data (both sensitive and non-sensitive)
      const updateData = { ...data };
      delete updateData._id;

      console.log("PUT - updateData to set:", JSON.stringify(updateData));
      
      const result = await User.findByIdAndUpdate(_id, updateData, { new: true });
      console.log("PUT - Update result:", JSON.stringify(result));
      
      if (!result) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
        });
      }
    } else {
      // If no _id, user is updating their own profile
      const email = session.user.email;
      const user = await User.findOne({ email });

      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
        });
      }

      // Prevent non-admin users from modifying sensitive fields
      if (admin !== undefined || isVerified !== undefined) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
        });
      }

      await User.findByIdAndUpdate(user._id, data, { new: true });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error.message);
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(JSON.stringify({ error: error.message }), { status });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    console.log("GET - Request for _id:", _id);

    if (_id) {
      await checkAdmin(session);
      const user = await User.findOne({ _id }).lean();
      console.log("GET - User fetched:", JSON.stringify(user));
      return new Response(JSON.stringify(user), { status: 200 });
    } else {
      const email = session.user.email;
      const user = await User.findOne({ email });

      if (!user) {
        return new Response("User not found", { status: 404 });
      }

      return new Response(JSON.stringify(user), { status: 200 });
    }
  } catch (error) {
    console.error("GET Error:", error);
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(JSON.stringify({ error: error.message }), { status });
  }
}