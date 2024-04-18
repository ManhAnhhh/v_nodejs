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
  } else if (password != confirmPassword) {
    res.render("admin/users/add_user", {
      data: { error: "Xác nhận mật khẩu không đúng!" },
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
  const id = req.params.id;
  const user = await UserModel.findById(id);
  const { full_name, email, password, role } = user;
  res.render("admin/users/edit_user", {
    full_name,
    email,
    password,
    role,
    data: {},
  });
};
const update = async (req, res) => {
  const id = req.params.id;
  const { full_name, email, password, confirmPassword, role } = req.body;
  const infor = {
    full_name,
    email,
    password,
    confirmPassword,
    role,
  };
  if (password != confirmPassword) {
    res.render("admin/users/edit_user", {
      ...infor,
      data: { error: "Xác nhận mật khẩu không đúng!" },
    });
  } else if (!full_name || !password || !confirmPassword) {
    let message = "Họ tên không được để trống!";
    if (!password) message = "Mật khẩu không được để trống!";
    res.render("admin/users/edit_user", {
      ...infor,
      data: { error: message },
    });
  } else {
    const user = {
      full_name,
      email,
      password,
      role,
    };
    await UserModel.updateOne({ _id: id }, { $set: user });
    res.redirect("/admin/users");
  }
};
const del = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  await UserModel.deleteOne({ _id: id});
  res.redirect("/admin/users");
}
module.exports = {
  index,
  create,
  store,
  edit,
  update,
  del
};
