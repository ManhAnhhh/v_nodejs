const ProductModel = require("../models/product");
const CategoryModel = require("../models/category");
const CommentModel = require("../models/comment");
const UserModel = require("../models/user");
const formetter = require("../../../lib");
const moment = require("moment");

const transporter = require("../../common/transporter");
const config = require("config");
const ejs = require("ejs");
const path = require("path");

const logout = async (req, res) => {
  delete req.session.emailUser;
  delete req.session.passwordUser;
  res.redirect("/");
};

const login = async (req, res) => {
  res.render("site/signin", { data: { error: [] } });
};
const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const message = [];
  for (const field in req.body) {
    if (req.body[field] === "" || req.body[field] === undefined) {
      message.push(`${field} không được để trống!`);
    }
  }
  if (message.length > 0) {
    res.render("site/signin", { data: { error: message } });
    return;
  }
  const user = await UserModel.find({ email, role: "member" });
  if (user.length == 0) {
    message[0] = "Tài khoản không đúng";
    res.render("site/signin", { data: { error: message } });
    return;
  }
  if (user[0].password != password) {
    message[0] = "Mật khẩu không đúng";
    res.render("site/signin", { data: { error: message } });
    return;
  }
  req.session.emailUser = email;
  req.session.passwordUser = password;
  res.redirect("/");
};
const signup = async (req, res) => {
  res.render("site/signup", { data: { error: [] } });
};
const createUser = async (req, res) => {
  const { full_name, email, password, confirmPassword } = req.body;
  const role = "member";
  const message = [];
  for (const field in req.body) {
    if (req.body[field] === "" || req.body[field] === undefined) {
      message.push(`${field} cannot be empty`);
    }
  }
  if (message.length > 0) {
    res.render("site/signup", { data: { error: message } });
    return;
  }
  const pattent = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.com$/;
  if (!pattent.test(email)) {
    message[0] = "Email sai định dạng (vd: a@gmail.com)";
    res.render("site/signup", { data: { error: message } });
    return;
  }
  if (password != confirmPassword) {
    message[0] = "Xác nhận mật khẩu không đúng";
    res.render("site/signup", { data: { error: message } });
    return;
  }
  const checkUser = await UserModel.find({ email }).countDocuments();
  if (checkUser == 1) {
    message[0] = "Email đã tồn tại";
    res.render("site/signup", { data: { error: message } });
    return;
  }
  const user = {
    full_name,
    email,
    password,
    role,
  };
  await new UserModel(user).save();
  res.redirect("/login");
};

const forget = async (req, res) => {
  res.render("site/forgets/forget", { data: {} });
};
const validateEmail = async (req, res) => {
  const email = req.body.email;
  req.session.emailChanged = email;
  const user = await UserModel.find({ email });
  console.log(user);
  if (user.length == 0 || user[0].role == "admin") {
    res.render("site/forgets/forget", {
      data: { error: "Email chưa đăng ký tài khoản " },
    });
    return;
  }
  const otp = Math.floor(Math.random() * 1000000);
  req.session.otpCode = otp;

  const viewPath = req.app.get("views");
  const html = await ejs.renderFile(
    path.join(viewPath, "site/forgets/otp-sendAcc.ejs"),
    {
      otp,
      full_name: user[0].full_name,
    }
  );
  const info = await transporter.sendMail({
    from: '"Manh Anh with love 👻" <ngomanhanh2k3@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Mã xác thực OTP cho tài khoản user VietProShop", // Subject line
    html,
  });

  res.redirect("/forget/verify");
};
const otp = async (req, res) => {
  const email = req.session.emailChanged;
  res.render("site/forgets/OTP", { data: {}, email });
};
const validateOTP = async (req, res) => {
  const email = req.session.emailChanged;
  const otp = req.body.otp;
  if (otp != req.session.otpCode) {
    res.render("site/forgets/OTP", {
      data: { error: "Mã OTP không đúng!" },
      email,
    });
    return;
  }
  res.redirect("/forget/verify/password");
};
const password = async (req, res) => {
  const email = req.session.emailChanged;
  res.render("site/forgets/password", { data: {}, email });
};
const update = async (req, res) => {
  const email = req.session.emailChanged;
  const { password, confirmPassword } = req.body;
  if (password != confirmPassword) {
    res.render("site/forgets/password", {
      data: { error: "Mật khẩu không khớp" },
      email,
    });
    return;
  }
  delete req.session.emailChanged;
  await UserModel.updateOne({ email }, { $set: { password } });
  res.redirect("/login");
};

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
  const html = await ejs.renderFile(
    path.join(viewPath, "site/email-order.ejs"),
    {
      ...body,
      items,
      formetter,
      totalPrice,
    }
  );

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
  login,
  postLogin,
  signup,
  createUser,
  logout,
  forget,
  validateEmail,
  otp,
  validateOTP,
  password,
  update,

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
