var User = require('../models/user');

//showSignup
exports.showSignup = function(req,res){
  res.render('signup',{title:'注册页面'});
};
//User Signup
exports.signup = function (req,res) {
  var _user = req.body;
  console.log(_user);
  User.findOne({$or:[{userName:_user.userName},{phoneNumber:_user.phoneNumber},{email:_user.email}]},function(err,user){
    console.log(user);
    if(err){
      console.log(err);
    }
    else{
      if(user){
        return res.send('该用户已被注册，请直接登录');
      }
      var newUser = new User(_user);
      newUser.save(function(err,user){
        if(err){
          console.log(err);
        }
        else{
          res.redirect('/signin');
        }
      });
    }
  }); 
};

//showSignin
exports.showSignin = function(req,res){
  res.render('login',{});
};
//User Signin
exports.signin = function (req,res) {
  var _user = req.body;
  var name = _user.userName;
  var password = _user.passWord;
  User.findOne({userName:name},function(err,user){
    if(err){
      console.log(err);
    }
    if(!user){
      return res.redirect('/login');
    }
    user.comparePassWord(password,function(err,isMatch){
      if(err){
        console.log(err);
      }
      if(isMatch){
        console.log('match');
        req.session.user = user;
        return res.redirect('/');
      }
      else{
        return res.redirect('/signin');
      }
    });
  });
};
//user layout
exports.logout = function (req,res) {
  delete req.session.user;
  //delete app.locals.user;
  res.redirect('/signin');
};

// midware for user
exports.signinRequired = function(req, res, next) {
  var user = req.session.user;
  if (!user) {
    return res.redirect('/signin');
  }
  next();
};
exports.adminRequired = function(req, res, next) {
  var user = req.session.user;
  if (user.role <= 10) {
    return res.redirect('/signin');
  }
  next();
};
