// ========== UTILS FOR CONNECTION MANAGEMENT ==========
async function ensureMongooseConnected() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw new Error("Database connection failed");
    }
  }
  
  // If connecting (state 1), wait for it
  if (mongoose.connection.readyState === 1) {
    return;
  }
  
  // If disconnecting/disconnected but not connecting, try again
  if (mongoose.connection.readyState === 3) {
    return ensureMongooseConnected();
  }
}

// ========== PRODUCTS API ROUTE ==========
import mongoose from "mongoose";
import { ProductItem } from "../../models/productItem";
import { Category } from "../../models/Category"; // ADD THIS LINE
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { User } from "@/app/models/User";

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
    await ensureMongooseConnected();
    await checkAdmin(req);

    const data = await req.json();
    const ProductItemDoc = await ProductItem.create(data);

    return new Response(JSON.stringify(ProductItemDoc), { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create product" }),
      { status: error.message ? status : 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await ensureMongooseConnected();
    await checkAdmin(req);

    const { _id, ...data } = await req.json();
    const updatedItem = await ProductItem.findByIdAndUpdate(_id, data, {
      new: true,
    });

    if (!updatedItem) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(updatedItem), { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({ error: error.message || "Failed to update product" }),
      { status: error.message ? status : 500 }
    );
  }
}

export async function GET(req) {
  try {
    await ensureMongooseConnected();

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    const getRelated = url.searchParams.get("related");
    const categoryId = url.searchParams.get("category");
    
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 12;
    const searchQuery = url.searchParams.get("search") || "";
    const isPaginated = url.searchParams.get("paginated") === "true";

    // Single product with related items
    if (_id && getRelated) {
      const mainProduct = await ProductItem.findById(_id);
      if (!mainProduct) {
        return new Response(JSON.stringify({ error: "Product not found" }), {
          status: 404,
        });
      }

      const relatedProducts = await ProductItem.aggregate([
        {
          $match: {
            category: new mongoose.Types.ObjectId(mainProduct.category),
            _id: { $ne: new mongoose.Types.ObjectId(_id) },
          },
        },
        { $sample: { size: 4 } },
      ]);

      return new Response(JSON.stringify(relatedProducts), { status: 200 });
    }

    // Single product by ID
    if (_id) {
      const productItem = await ProductItem.findById(_id);
      if (!productItem) {
        return new Response(JSON.stringify({ error: "Product not found" }), {
          status: 404,
        });
      }
      return new Response(JSON.stringify(productItem), { status: 200 });
    }

    // Paginated search with category and search query
    if (isPaginated) {
      const skip = (page - 1) * limit;
      const query = {};

      if (categoryId) {
        query.category = new mongoose.Types.ObjectId(categoryId);
      }

      if (searchQuery) {
        query.name = { $regex: searchQuery, $options: "i" };
      }

      const totalProducts = await ProductItem.countDocuments(query);
      const products = await ProductItem.find(query)
        .populate("category")
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      const totalPages = Math.ceil(totalProducts / limit);

      return new Response(
        JSON.stringify({
          products,
          pagination: {
            currentPage: page,
            totalPages,
            totalProducts,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        }),
        { status: 200 }
      );
    }

    // Products by category with pagination
    if (categoryId) {
      const skip = (page - 1) * limit;

      const totalProducts = await ProductItem.countDocuments({
        category: new mongoose.Types.ObjectId(categoryId),
      });

      if (totalProducts === 0) {
        return new Response(
          JSON.stringify({
            products: [],
            pagination: {
              currentPage: page,
              totalPages: 0,
              totalProducts: 0,
              limit,
              hasNextPage: false,
              hasPrevPage: false,
            },
          }),
          { status: 200 }
        );
      }

      const products = await ProductItem.find({
        category: new mongoose.Types.ObjectId(categoryId),
      })
        .populate("category")
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      const totalPages = Math.ceil(totalProducts / limit);

      return new Response(
        JSON.stringify({
          products,
          pagination: {
            currentPage: page,
            totalPages,
            totalProducts,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        }),
        { status: 200 }
      );
    }

    // All products
    const productItems = await ProductItem.find()
      .populate("category")
      .sort({ createdAt: -1 });
    
    return new Response(JSON.stringify(productItems), { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch products",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await ensureMongooseConnected();
    await checkAdmin(req);

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    
    const result = await ProductItem.deleteOne({ _id });
    
    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({ error: error.message || "Failed to delete product" }),
      { status: error.message ? status : 500 }
    );
  }
}