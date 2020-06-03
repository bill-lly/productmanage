var express = require('express');
var router = express.Router();
var User = require('../app/controllers/user');
var Category = require('../app/controllers/category');
var Product = require('../app/controllers/product');
//预处理
router.use(function(req, res, next) {
  var _user = req.session.user;
  req.app.locals.user = _user; //当前请求的全局本地变量  
  next();
});

//showSignin
router.get('/signin', User.showSignin);
//User Signin
router.post('/user/signin', User.signin);
//user layout
router.get('/logout', User.logout);
//User Signup
router.post('/user/signup', User.signup);
//showSingup
router.get('/signup', User.showSignup);
//user layout
router.get('/logout', User.logout);

//product
router.get('/', User.signinRequired, User.adminRequired, Product.index);
//detail page
router.get('/product/:id', User.signinRequired, User.adminRequired, Product.detail);
router.get('/admin/product', User.signinRequired, User.adminRequired, Product.new);
router.post('/admin/product/new', User.signinRequired, User.adminRequired, Product.savePic, Product.save);
//list page
router.post('/admin/product/list', User.signinRequired, User.adminRequired, Product.list);
//delete movie
router.get('/admin/product/list', User.signinRequired, User.adminRequired, Product.del);
//admin update
router.get('/admin/product/update/:id', User.signinRequired, User.adminRequired, Product.update);

//Category
router.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
router.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
router.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);

module.exports = router;