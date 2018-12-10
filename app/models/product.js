var mongoose = require('mongoose');
var productSchema = require('../schemas/product');
var Product = mongoose.model('Product',productSchema);
module.exports = Product;