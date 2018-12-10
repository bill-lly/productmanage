var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId; 
var productSchema = new Schema({
  title: String,//商品名称
  price: Number,
  postage: Number,//邮费
  picture: String,
  description: String,
  pv: {type: Number,default: 0},//访客数量
  add_by: {type: ObjectId,ref: 'User'},
  category: {type: ObjectId,ref: 'Category'},
  meta: {
    createAt: {type: Date,default: Date.now()},
    updateAt: {type: Date,default: Date.now()}
  } 
});

productSchema.pre('save',function (next) {
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else
    this.meta.updateAt = Date.now();
  next();
});

productSchema.statics = {
  fetch: function(cb){
    return this.find({}).sort('meta.updateAt').exec(cb);
  },
  findById: function(id,cb){
    return this.findOne({_id: id}).exec(cb);
  },
  findByTitle: function (_title,cb) {
    return this.find({title:{$regex:_title}}).sort('meta.updateAt').exec(cb);
  },
  deleteById: function(id,cb){
    return this.findByIdAndRemove({_id: id}).exec(cb);
  }
};

module.exports = productSchema;