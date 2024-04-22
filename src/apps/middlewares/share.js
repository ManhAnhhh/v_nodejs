const formetter = require("../../../lib");

const CategoryModel = require("../models/category");
module.exports = async (req, res, next) => {
  res.locals.emailUserAcc = req.session.emailUser;
  res.locals.emailadminAcc = req.session.email;
  res.locals.categories = await CategoryModel.find();
  res.locals.totalCartItems = req.session.cart.length;
  res.locals.formetter = formetter;
  next();
};
