var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId; 
var categorySchema = new Schema({
  name: String,
  products: [{type: ObjectId,ref: 'Product'}],
  meta: {
    createAt: {type: Date,default: Date.now()},
    updateAt: {type: Date,default: Date.now()}
  }
});//,{timestamps: true});

categorySchema.pre('save',function (next) {
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else
    this.meta.updateAt = Date.now();
  next();
});

categorySchema.statics = {
  fetch: function(cb){
    return this.find({}).sort('meta.updateAt').exec(cb);
  },
  findById: function(id,cb){
    return this.findOne({_id: id}).exec(cb);
  }
};

module.exports = categorySchema;
