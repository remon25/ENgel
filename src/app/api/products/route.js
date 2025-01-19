import mongoose from "mongoose";
import { ProductItem } from "../../models/productItem";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { User } from "@/app/models/User";

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
    await checkAdmin(req);

    const data = await req.json();
    const ProductItemDoc = await ProductItem.create(data);

    return new Response(JSON.stringify(ProductItemDoc), { status: 201 });
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create menu item" }),
      { status: error.message ? status : 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await checkAdmin(req);

    const { _id, ...data } = await req.json();
    const updatedItem = await ProductItem.findByIdAndUpdate(_id, data, {
      new: true,
    });

    return new Response(JSON.stringify(updatedItem), { status: 200 });
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({ error: error.message || "Failed to update menu item" }),
      { status: error.message ? status : 500 }
    );
  }
}

export async function GET(req) {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    const getRelated = url.searchParams.get("related");

    if (_id && getRelated) {
      // Fetch the main product first to get its category
      const mainProduct = await ProductItem.findById(_id);
      if (!mainProduct) {
        return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
      }

      // Fetch 4 random related products from the same category, excluding the current product
      const relatedProducts = await ProductItem.aggregate([
        { 
          $match: { 
            category: new mongoose.Types.ObjectId(mainProduct.category),
            _id: { $ne: new mongoose.Types.ObjectId(_id) }
          }
        },
        { $sample: { size: 4 } }
      ]);

      return new Response(JSON.stringify(relatedProducts), { status: 200 });
    } else if (_id) {
      const productItem = await ProductItem.findById(_id);
      if (!productItem) {
        return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
      }
      return new Response(JSON.stringify(productItem), { status: 200 });
    } else {
      const productItems = await ProductItem.find();
      return new Response(JSON.stringify(productItems), { status: 200 });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch product(s)" }),
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  try {
    await checkAdmin(req);

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    await ProductItem.deleteOne({ _id });

    return new Response(JSON.stringify(true), { status: 200 });
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({ error: error.message || "Failed to delete menu item" }),
      { status: error.message ? status : 500 }
    );
  }
}
