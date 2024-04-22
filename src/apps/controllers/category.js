const CategoryModel = require("../models/category");
const ProductModel = require("../models/product");
const index = async (req, res) => {
  const categories = await CategoryModel.find();
  const totalProducts = {};
  for (let category of categories) {
    const products = await ProductModel.find({ cat_id: category.id });
    totalProducts[category.title] = products.length;
  }
  res.render("admin/categories/category", { categories, totalProducts });
};
const create = async (req, res) => {
  res.render("admin/categories/add_category");
};
const edit = async (req, res) => {
  const id = req.params.id;
  res.render("admin/categories/edit_category");
};
const del = async (req, res) => {
  const id = req.params.id;
  res.redirect("/admin/categories/");
};
module.exports = {
  index,
  create,
  edit,
  del,
};
