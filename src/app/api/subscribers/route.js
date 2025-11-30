import mongoose from "mongoose";
import { Subscriber } from "../../models/Subscriber";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { User } from "../../models/User";

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function checkAdmin(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user || !user.admin) {
    throw new Error("Forbidden");
  }
}

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "E-Mail ist erforderlich" }),
        { status: 400 }
      );
    }

    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return new Response(
        JSON.stringify({ error: "Diese E-Mail ist bereits abonniert" }),
        { status: 409 }
      );
    }

    const subscriber = await Subscriber.create({ email });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Erfolgreich abonniert",
        subscriber 
      }),
      { status: 201 }
    );
  } catch (error) {
    // Handle duplicate key error from MongoDB
    if (error.code === 11000) {
      return new Response(
        JSON.stringify({ error: "Diese E-Mail ist bereits abonniert" }),
        { status: 409 }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Abonnement fehlgeschlagen. Bitte versuchen Sie es später erneut." }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await checkAdmin(req);

    const subscribers = await Subscriber.find({ isActive: true });
    return new Response(
      JSON.stringify({ count: subscribers.length, subscribers }),
      { status: 200 }
    );
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({ error: error.message || "Abonnenten konnten nicht abgerufen werden" }),
      { status: error.message ? status : 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await checkAdmin(req);

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    
    if (!_id) {
      return new Response(
        JSON.stringify({ error: "ID ist erforderlich" }),
        { status: 400 }
      );
    }

    await Subscriber.deleteOne({ _id });

    return new Response(
      JSON.stringify({ success: true, message: "Abonnent erfolgreich gelöscht" }),
      { status: 200 }
    );
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({ error: error.message || "Fehler beim Löschen des Abonnenten" }),
      { status: error.message ? status : 500 }
    );
  }
}