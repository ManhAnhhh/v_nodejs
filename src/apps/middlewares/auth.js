const checkAdmin = (req, res, next) => {
  if (!req.session.email || !req.session.password) {
    res.redirect("/admin/login");
  }
  next();
};

const checkLogin = (req, res, next) => {
  if (req.session.email || req.session.password) {
    res.redirect("/admin/dashboard");
  }
  next();
};
const checkLogout = (req, res, next) => {
  if(req.session.email && req.session.password) {
    delete req.session.email;
    delete req.session.password;
  }
  next();
}

const checkAccountForget = (req, res, next) => {
  if (!req.session.emailChanged) {
    res.redirect("/forget");
  }
  next();
}
const checkLoginUser = (req, res, next) => {
  if (req.session.emailUser || req.session.passwordUser) {
    res.redirect("/");
  }
  next();
}
module.exports = {
  checkAdmin,
  checkLogin,
  checkLogout,
  checkAccountForget,
  checkLoginUser
};
