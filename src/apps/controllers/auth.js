const UserModel = require("../models/user.js");
// hien thi giao dien

const getLogin = (req, res) => {
  res.render("admin/login", { data: {} });
};
// xu ly khi submit data
const postLogin = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  const user = await UserModel.find({ email, password });
  if (user.length > 0) {
    req.session.email = email;
    req.session.password = password;
    res.redirect("/admin/dashboard");
  } else {
    console.log("object");
    res.render("admin/login", { data: { error: "Tài khoản không hợp lệ!" } });
  }

  // email == "vietpro.edu.vn@gmail.com" && password == "123456"
  //   ? res.redirect("/admin/dashboard")
  //   : res.render("admin/login", { data: { error: "Tài khoản không hợp lệ!" } });
  // res.send("login");
};
const logout = (req, res) => {
  res.render("admin/login", { data: {} });
};
module.exports = {
  getLogin,
  postLogin,
  logout,
};
