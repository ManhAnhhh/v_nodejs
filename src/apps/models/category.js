const mongoose = require("../../common/database")();
const categorySchema = new mongoose.Schema(
  {
    description: {
      type: String,
      //required: true,
      default: "",
    },
    title: {
      type: String,
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
const categoryModel = mongoose.model("Categories", categorySchema, "categories");
module.exports = categoryModel;

