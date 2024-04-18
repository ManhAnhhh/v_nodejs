const UserModel = require("../models/user");
const index = async (req, res) => {
  const users = await UserModel.find();
  res.render("admin/users/user", { users });
};
const create = async (req, res) => {
  res.render("admin/users/add_user", { data: {} });
};
const store = async (req, res) => {
  const { full_name, email, password, confirmPassword, role } = req.body;
  const checkUser = await UserModel.find({ email });
  if (checkUser.length > 0) {
    res.render("admin/users/add_user", {
      data: { error: "Email đã tồn tại !" },
    });
  } else {
    const user = {
      full_name,
      email,
      password,
      role,
    };
    new UserModel(user).save();
    res.redirect("/admin/users");
  }
};

const edit = async (req, res) => {
  res.render("admin/users/edit_user")
}
module.exports = {
  index,
  create,
  store,
  edit
};
