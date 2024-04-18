const UserModel = require("../models/user");
const CommentModel = require("../models/comment");
const ProductModel = require("../models/product");

const index = async (req, res) => {
  const totalProducts = await ProductModel.find().countDocuments();
  const totalComments = await CommentModel.find().countDocuments();
  const totalUsers = await UserModel.find().countDocuments();
  res.render("admin/dashboard", { totalProducts, totalComments, totalUsers });
};
module.exports = {
  index,
};
