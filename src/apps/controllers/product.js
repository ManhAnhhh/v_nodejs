const slug = require("slug");
const fs = require("fs");
const path = require("path");

const CategoryModel = require("../models/category");
const ProductModel = require("../models/product");
const pagination = require("../../common/pagination");

const index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) ||10;
  const skip = page * limit - limit;
  const totalRows = await ProductModel.find().countDocuments(); // tong so product
  const totalPages = Math.ceil(totalRows / limit);
  const products = await ProductModel.find()
    .populate({ path: "cat_id" })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  res.render("admin/products/product.ejs", {
    products,
    skip,
    pages: pagination(page, limit, totalRows),
    page,
    totalPages,
  });
};

const create = async (req, res) => {
  const categories = await CategoryModel.find().sort({ id: -1 });
  res.render("admin/products/add_product.ejs", { categories });
};
const store = async (req, res) => {
  const { body, file } = req;
  // console.log(body);
  // console.log(file);

  const product = {
    name: body.name,
    price: body.price,
    status: body.status,
    cat_id: body.cat_id,
    featured: body.featured == "on",
    is_stock: body.is_stock,
    promotion: body.promotion,
    accessories: body.accessories,
    warranty: body.warranty,
    description: body.description,
    slug: slug(body.name),
  };

  // upload
  if (file) {
    const thumbnail = `products/${file.originalname}`;
    product["thumbnail"] = thumbnail;
    fs.renameSync(
      file.path,
      path.resolve("src/public/upload/images/", thumbnail)
    );
    new ProductModel(product).save();
    res.redirect("/admin/products");
  }
};

const edit = (req, res) => {
  res.render("admin/products/edit_product.ejs");
};
const del = async (req, res) => {
  const { id } = req.params;
  await ProductModel.deleteOne({ _id: id });
  res.redirect("/admin/products");
};
module.exports = {
  index,
  create,
  store,
  edit,
  del,
};
