const UserModel = require("../models/user.js");
// hien thi giao dien

const getLogin = (req, res) => {
  res.render("admin/login", { data: {} });
};
// xu ly khi submit data
const postLogin = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  const user = await UserModel.find({ email, password, role: "admin" });
  if (user.length > 0) {
    req.session.email = email;
    req.session.password = password;
    res.redirect("/admin/dashboard");
  } else {
    res.render("admin/login", { data: { error: "Tài khoản không hợp lệ!" } });
  }

  
};
const logout = (req, res) => {
  res.render("admin/login", { data: {} });
};
module.exports = {
  getLogin,
  postLogin,
  logout,
};
