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
module.exports = {
  checkAdmin,
  checkLogin,
  checkLogout
};
