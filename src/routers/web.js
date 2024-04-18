const express = require("express");
const router = express.Router();

// admin controller
const AuthController = require("../apps/controllers/auth");
const DashboardController = require("../apps/controllers/dashboard");
const UserController = require("../apps/controllers/user");
const CategoryController = require("../apps/controllers/category");
const ProductController = require("../apps/controllers/product");
const CommentController = require("../apps/controllers/comment");
const AdsController = require("../apps/controllers/Ads");
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
router.get("/admin/logout",AuthMiddleware.checkLogout ,AuthController.logout);
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
router.get(
  "/admin/users",
  AuthMiddleware.checkAdmin,
  UserController.index
);
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

// router category
router.get(
  "/admin/categories",
  AuthMiddleware.checkAdmin,
  CategoryController.index
);
// router comment
router.get(
  "/admin/comments",
  AuthMiddleware.checkAdmin,
  CommentController.index
);
// router ads
router.get(
  "/admin/ads",
  AuthMiddleware.checkAdmin,
  AdsController.index
);
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
