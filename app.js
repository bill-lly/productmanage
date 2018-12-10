var express = require('express');
var app = new express();
var path = require('path');

var bodyParser = require('body-parser');
var multer = require('multer');

app.locals.moment = require('moment');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/routes');

var config = require('./config');
var mongoose = require('mongoose');
var dbURL = 'mongodb://' + config.userName + ':' + config.passWord + '@' + config.dbURL;

//静态文件托管
app.use(express.static(path.join(__dirname, 'public')));

//视图设置
app.set('views', './app/views/pages');
//ejs模板引擎设置
app.set("view engine", "ejs");

//处理表单提交数据
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(multer());

//会话持久化
app.use(cookieParser());
app.use(session({
  secret: 'product',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30
  }, //设置cookie过期时间
  rolling: true, //强行重新设置cookie
  store: new MongoStore({
    url: dbURL,
    collection: 'sessions'
  })
}));

//连接数据库
mongoose.connect(dbURL, {
  useNewUrlParser: true
}, function(err) {　　
  if (err) {　　　　
    console.log('Connection Error:' + err);　　
  } else {　　　　
    console.log('Connect mongodb success!');
  }
});

//加载路由
app.use(routes);

app.listen(config.port);
console.log('product start at port:' + config.port);