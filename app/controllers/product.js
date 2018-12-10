var Product = require('../models/product');
var User = require('../models/user');
var Category = require('../models/category');
var fs = require('fs');
var path = require('path');
var underscore = require('underscore');

//show index
exports.index =  function (req,res) {
  res.render('productlist',{user:req.session.user,products:{}}); 
};
//product update
exports.update = function (req,res) {
  var id = req.params.id;
  if (id){
    Product.findOne({_id:id}).populate('category','name').exec(function(err,product){
      if(err){
        return console.log(err);
      }
      Category.find({},function(err,categories){
        if(err){
          return console.log(err);
        }
        res.render('productedit',{
          title: 'product 后台录入页',
          product: product,
          categories:categories
        });
      });
    });
  }
};


//detail page
exports.detail=function (req,res) {
  var id = req.params.id;
  Product.updateOne({_id:id},{$inc: {pv: 1}},function(err,raw){
    if (err) {
      console.log(err);
    }    
  });
  Product.findById(id,function(err,product){
    if (err) {
      return console.log(err);
    }
    Category.findById(product.category,function (err,category) {
      if (err){
        return console.log(err);
      }
      res.render('productdetail',{
      title:'product 详情页',
      product:product,
      category:category});
    }); 
  });
};

//show productadd page
exports.new = function (req,res) {
  Category.find({}).exec(function(err,categories){
  res.render('productedit',
    {
      title:'product 后台录入页',
      categories:categories,
      product:{}
    });
  });
};
//admin picture
exports.savePic = function(req,res,next){
  var pictureData = req.files.uploadPicture;
  if (!pictureData){
    next();
  }
  else{
    var filePath = pictureData.path;
    var originalname = pictureData.originalname;
    if(originalname){
      fs.readFile(filePath,function (err,data) {
        if(err){
          return console.log(err);
        }
        var timestamp = Date.now();
        var type = pictureData.mimetype.split('/')[1];
        var picture = timestamp+'.'+type;
        var newPath = path.join(__dirname,'../../','/public/upload/'+picture);
        fs.writeFile(newPath,data,function(err){
          if(err){
            return console.log(err);    
          }
          req.picture = picture;
          next();
        });    
      });
    }
    else{
      next();
    }
  }
};
//admin product new 
exports.save = function(req,res){
  var id = req.body.product._id;
  var productobj = req.body.product;
  if(req.picture){
    productobj.picture = req.picture;
  }
  var _product;
  if (id) {
    Product.findById(id,function(err,product){
      if (err){
        return console.log(err);
      }
      _product = underscore.extend(product,productobj);
      _product.save(function(err,product){
        if (err){
          return console.log(err);
        }
        res.redirect('/product/'+product._id);
      });
    });
  }
  else{
    _product = new Product(productobj);
    _product.save(function(err,product){
      if (err){
        return console.log(err);
      }
      Category.findById(_product.category,function(err,category){
        if (err){
          return console.log(err);
        }
        category.products.push(product._id);
        category.save(function(err,category){
          if (err){
           return console.log(err);
          } 
          res.redirect('/product/'+product._id);
        });
      });
    });
  }
};

//product list
exports.list = function(req,res){
  var _searchField = req.body.searchField;
  Product.findByTitle(_searchField,function (err,products) {
    if(err){
      console.log(err);
    }
    res.render('productlist',{title:'product列表页',products:products});
  });
};

//list delete movie
exports.del = function (req,res) {
  var id = req.query.id;
  if(id){
    Product.deleteById(id,function(err,product){
      if(err){
        console.log(err);
      }
      else{
        Category.findOneAndUpdate({_id:product.category}, {$pull: {products: product._id}}, function(err, data){
          if(err){
            console.log(err);
          }
          res.redirect('/');
        });
      }
    });
  }
};