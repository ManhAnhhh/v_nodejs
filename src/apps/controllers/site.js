const ProductModel = require("../models/product");
const CategoryModel = require("../models/category");
const CommentModel = require("../models/comment");
const formetter = require("../../../lib");
const moment = require("moment");

const transporter = require("../../common/transporter");
const config = require("config");
const ejs = require("ejs");
const path = require("path");

const home = async (req, res) => {
  const featured = await ProductModel.find({ featured: true })
    .sort({ _id: -1 })
    .limit(6);
  const latest = await ProductModel.find({ is_stock: true })
    .sort({ _id: -1 })
    .limit(6);
  // console.log(featured);
  // console.log(featured.length);
  res.render("site/index", { featured, latest });
};
const category = async (req, res) => {
  const id = req.params.id;
  const products = await ProductModel.find({ cat_id: id });
  const category = await CategoryModel.findById(id);
  const title = category.title;
  const total = products.length;
  // console.log(products, title, total);
  res.render("site/category", { products, title, total });
};

const product = async (req, res) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id);
  const comments = await CommentModel.find({ prd_id: id }).sort({ _id: -1 });
  // console.log(product);
  // console.log(comments);
  res.render("site/product", { product, comments, moment });
};

const comment = async (req, res) => {
  const id = req.params.id;
  const comment = {
    prd_id: id,
    full_name: req.body.full_name,
    email: req.body.email,
    body: req.body.body,
  };
  await new CommentModel(comment).save();
  res.redirect(req.path);
};

const search = async (req, res) => {
  const { keyword } = req.query;
  const products = await ProductModel.find({ $text: { $search: keyword } });
  const total = products.length;
  // console.log(products);
  res.render("site/search", { keyword, products, total });
};
const cart = (req, res) => {
  const products = req.session.cart;
  const totalPrice = products.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );
  res.render("site/cart", { products, totalPrice, formetter });
};

const addToCart = async (req, res) => {
  const body = req.body;
  let items = req.session.cart;

  //	Sản phẩm mua rồi thì tăng số lượng
  let isUpdate = false;
  items.map((item) => {
    if (body.id === item.id) {
      isUpdate = true;
      item.qty += parseInt(body.qty);
    }
    return item;
  });

  //	Sản phẩm chưa mua thì thêm mới
  if (!isUpdate) {
    const product = await ProductModel.findById(body.id);
    items.push({
      id: product._id,
      name: product.name,
      price: product.price,
      thumbnail: product.thumbnail,
      qty: parseInt(body.qty),
    });
  }
  req.session.cart = items;
  res.redirect("/cart");
};

const updateItemCart = (req, res) => {
  const { products } = req.body;
  let items = req.session.cart;

  items = items.map((item) => {
    if (products[item.id]) item.qty = products[item.id].qty;
    return item;
  });
  // console.log(items);
  // console.log(body.product);
  req.session.cart = items;
  res.redirect("/cart");
};

const deleteItemCart = (req, res) => {
  const items = req.session.cart;
  const { id } = req.params;
  const newItems = items.filter((item) => item.id != id);
  req.session.cart = newItems;
  res.redirect("/cart");
};

const order = async (req, res) => {
  const { body } = req;
  const items = req.session.cart;
  const viewPath = req.app.get("views");
  const totalPrice = items.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );
  // console.log(body, items);
  // ../views/site/email-order.ejs
  // path.join: giúp hợp nhất url vào thành 1 ở đây là: /viewPath/site/email-order.ejs
  const html = await ejs.renderFile(path.join(viewPath, "site/email-order.ejs"), {
    ...body,
    items,
    formetter,
    totalPrice
  });

  const info = await transporter.sendMail({
    from: '"Manh Anh with love 👻" ngomanhanh2k3@gmail.com', // sender address
    to: body.email, // list of receivers
    subject: "Xác nhận đơn hàng từ Manh Anh", // Subject line
    html, // html body
  });

  req.session.cart = [];
  res.redirect("/success");
};

const success = (req, res) => {
  res.render("site/success");
};

module.exports = {
  home,
  category,
  product,
  comment,
  search,
  cart,
  addToCart,
  updateItemCart,
  deleteItemCart,
  order,
  success,
};
