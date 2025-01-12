import { User } from "@/app/models/User";
import mongoose from "mongoose";

export async function POST(request) {
  const { email, token } = await request.json();
  mongoose.connect(process.env.MONGO_URL);

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found." }), {
      status: 404,
    });
  }

  if (!user.token || user.token !== token || new Date() > user.tokenExpiration) {
    return new Response(JSON.stringify({ error: "Invalid or expired token." }), {
      status: 401,
    });
  }

  return new Response(JSON.stringify({ message: "Token is valid." }), {
    status: 200,
  });
}
