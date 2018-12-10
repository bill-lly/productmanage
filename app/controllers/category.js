var Category = require('../models/category');
//admin new page
exports.new = function (req,res) {
  res.render('category_admin',{title:'product分类后台录入页'});
};

//admin post new 
exports.save = function(req,res){
  var _category = req.body.category;
  var category = new Category(_category);
  category.save(function(err,category){
    if (err){
    console.log(err);
    }
    res.redirect('/admin/category/list');
  });
};

//list page
exports.list = function (req,res) {
  Category.fetch(function(err,categories){
    if(err){
      console.log(err);
    }
    res.render('category_list',{title:'product分类列表页',categories:categories});
  });
};