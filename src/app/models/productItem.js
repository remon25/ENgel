import mongoose, { model, models, Schema } from "mongoose";

const ExtraOptionSchema = new Schema({
  name: String,
  price: Number,
});

const ProductSchema = new Schema(
  {
    bannerImage: {
      type: String,
    },
    moreImages: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 7"],
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sizes: {
      type: [ExtraOptionSchema],
    },
    extraOptions: {
      type: [ExtraOptionSchema],
    },
    stock: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 7;
}

export const ProductItem = models?.ProductItem || model("ProductItem", ProductSchema);
