import mongoose from "mongoose";
import { DeliveryPrice } from "../../models/DeliverPrices";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/app/models/User";

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Reuse the checkAdmin function from your first API
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

export async function GET() {
  try {
    // No authentication required for GET, fetch prices for all users (logged in or not)
    const deliveryPrices = await DeliveryPrice.find();
    const adjustedPrices = deliveryPrices.map((price) => ({
      ...price._doc,
      price: price.isFreeDelivery ? 0 : price.price,
    }));
    return new Response(JSON.stringify(adjustedPrices), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch delivery prices" }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await checkAdmin(req);

    const { _id, price, postalCode, minimumOrder, isFreeDelivery } =
      await req.json();

    if (!_id || typeof price !== "number") {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
      });
    }

    const updatedPrice = await DeliveryPrice.findByIdAndUpdate(
      _id,
      { price, postalCode, minimumOrder, isFreeDelivery },
      { new: true }
    );

    if (!updatedPrice) {
      return new Response(JSON.stringify({ error: "Price not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedPrice), { status: 200 });
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to update delivery price",
      }),
      { status: error.message ? status : 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await checkAdmin(req); // Restrict to admin

    await DeliveryPrice.updateMany(
      { isFreeDelivery: { $exists: false } },
      { $set: { isFreeDelivery: false } }
    );

    const { isFreeDelivery } = await req.json();

    if (typeof isFreeDelivery !== "boolean") {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
      });
    }

    await DeliveryPrice.updateMany({}, { isFreeDelivery });

    return new Response(
      JSON.stringify({ message: "Delivery prices updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to update delivery prices",
      }),
      { status: error.message ? status : 500 }
    );
  }
}

export async function POST(req) {
  try {
    await checkAdmin(req);

    const { name, postalCode, price, minimumOrder, isFreeDelivery } =
      await req.json();

    if (
      !name ||
      !postalCode ||
      typeof price !== "number" ||
      typeof minimumOrder !== "number"
    ) {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
      });
    }

    const newPrice = await DeliveryPrice.create({
      name,
      postalCode,
      price,
      minimumOrder,
      isFreeDelivery,
    });

    return new Response(JSON.stringify(newPrice), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to add delivery price",
      }),
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  try {
    await checkAdmin(req); // Restrict to admin users

    const { _id } = await req.json();

    if (!_id) {
      return new Response(JSON.stringify({ error: "Missing ID" }), {
        status: 400,
      });
    }

    const deletedPrice = await DeliveryPrice.findByIdAndDelete(_id);

    if (!deletedPrice) {
      return new Response(JSON.stringify({ error: "Price not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Delivery price deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to delete delivery price",
      }),
      { status: error.message ? status : 500 }
    );
  }
}