const mongoose = require("../../common/database")();
const productSchema = new mongoose.Schema(
  {
    thumbnail: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
    },

    cat_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Categories",
    },

    status: {
      type: String,
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    promotion: {
      type: String,
      required: true,
    },

    warranty: {
      type: String,
      required: true,
    },

    accessories: {
      type: String,
      required: true,
    },

    is_stock: {
      type: Boolean,
      default: true,
    },

    name: {
      type: String,
      text: true,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const productModel = mongoose.model("Products", productSchema, "products");
module.exports = productModel;
