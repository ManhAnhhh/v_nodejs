const express = require("express");
const router = express.Router();

// admin controller
const AuthController = require("../apps/controllers/auth");
const DashboardController = require("../apps/controllers/dashboard");
const UserController = require("../apps/controllers/user");
const CategoryController = require("../apps/controllers/category");
const ProductController = require("../apps/controllers/product");
const CommentController = require("../apps/controllers/comment");
const BannerController = require("../apps/controllers/banner");
const SlideController = require("../apps/controllers/slide");
const SettingController = require("../apps/controllers/setting");

const AuthMiddleware = require("../apps/middlewares/auth");
const UpLoadMiddleware = require("../apps/middlewares/upload");

// site controller
const SiteController = require("../apps/controllers/site");

// router admin
router.get("/admin/login", AuthMiddleware.checkLogin, AuthController.getLogin);
router.post(
  "/admin/login",
  AuthMiddleware.checkLogin,
  AuthController.postLogin
);
router.get("/admin/logout", AuthMiddleware.checkLogout, AuthController.logout);
router.post(
  "/admin/logout",
  AuthMiddleware.checkLogin,
  AuthController.postLogin
);
// router dashboard
router.get(
  "/admin/dashboard",
  AuthMiddleware.checkAdmin,
  DashboardController.index
);
// router user
router.get("/admin/users", AuthMiddleware.checkAdmin, UserController.index);
router.get(
  "/admin/users/create",
  AuthMiddleware.checkAdmin,
  UserController.create
);
router.post(
  "/admin/users/store",
  AuthMiddleware.checkAdmin,
  UserController.store
);
router.get(
  "/admin/users/edit-:id",
  AuthMiddleware.checkAdmin,
  UserController.edit
);
router.post(
  "/admin/users/edit-:id",
  AuthMiddleware.checkAdmin,
  UserController.update
);
router.get(
  "/admin/users/del-:id",
  AuthMiddleware.checkAdmin,
  UserController.del
);

// router category
router.get(
  "/admin/categories",
  AuthMiddleware.checkAdmin,
  CategoryController.index
);
router.get(
  "/admin/categories/create",
  AuthMiddleware.checkAdmin,
  CategoryController.create
);
router.get(
  "/admin/categories/edit-:id",
  AuthMiddleware.checkAdmin,
  CategoryController.edit
);
router.get(
  "/admin/categories/del-:id",
  AuthMiddleware.checkAdmin,
  CategoryController.del
);

// router comment
router.get(
  "/admin/comments",
  AuthMiddleware.checkAdmin,
  CommentController.index
);
// router banner
router.get("/admin/banners", AuthMiddleware.checkAdmin, BannerController.index);
// router slide
router.get("/admin/slides", AuthMiddleware.checkAdmin, SlideController.index);
// router setting
router.get(
  "/admin/setting",
  AuthMiddleware.checkAdmin,
  SettingController.index
);

// router product
router.get(
  "/admin/products",
  AuthMiddleware.checkAdmin,
  ProductController.index
);
router.get(
  "/admin/products/create",
  AuthMiddleware.checkAdmin,
  ProductController.create
);
router.post(
  "/admin/products/store",
  UpLoadMiddleware.single("thumbnail"),
  AuthMiddleware.checkAdmin,
  ProductController.store
);
router.get(
  "/admin/products/edit/",
  AuthMiddleware.checkAdmin,
  ProductController.edit
);
router.get(
  "/admin/products/delete/:id",
  AuthMiddleware.checkAdmin,
  ProductController.del
);

router.get("/login", AuthMiddleware.checkLoginUser, SiteController.login);
router.post("/login", AuthMiddleware.checkLoginUser, SiteController.postLogin);
router.get("/signup", AuthMiddleware.checkLoginUser, SiteController.signup);

router.get("/lougout", AuthMiddleware.checkLoginUser, SiteController.logout);

router.get("/forget", SiteController.forget);
router.post("/forget", SiteController.validateEmail);
router.get(
  "/forget/verify",
  AuthMiddleware.checkAccountForget,
  SiteController.otp
);
router.post(
  "/forget/verify",
  AuthMiddleware.checkAccountForget,
  SiteController.validateOTP
);
router.get(
  "/forget/verify/password",
  AuthMiddleware.checkAccountForget,
  SiteController.password
);
router.post(
  "/forget/verify/password",
  AuthMiddleware.checkAccountForget,
  SiteController.update
);

router.post("/signup", SiteController.createUser);
router.get("/logout", SiteController.logout);

router.get("/", SiteController.home);
router.get("/category-:slug.:id", SiteController.category);
router.get("/product-:slug.:id", SiteController.product);
router.post("/product-:slug.:id", SiteController.comment);
router.get("/search", SiteController.search);

router.get("/cart", SiteController.cart);
router.post("/add-to-cart", SiteController.addToCart);
router.post("/update-item-cart", SiteController.updateItemCart);
router.get("/del-item-cart-:id", SiteController.deleteItemCart);

router.post("/order", SiteController.order);

router.get("/success", SiteController.success);

module.exports = router;
