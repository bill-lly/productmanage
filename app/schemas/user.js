var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;
var userSchema = new Schema({
  userName: String,
  phoneNumber: {type :String,unique: true},
  email: {type :String,unique: true},
  passWord: String,
  role: {type: Number,default: 0},
  // 0: nomal user
  // 1: verified user
  // 2: professonal user
  // >10: admin
  // >50: super admin
  meta: {
    createAt: {type: Date,default: Date.now()},
    updateAt: {type: Date,default: Date.now()}
  }
});//,{timestamps: true});

userSchema.pre('save',function (next) {
  var user = this;
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else{
    this.meta.updateAt = Date.now();
  } 
  bcrypt.genSalt(SALT_WORK_FACTOR,function (err,salt){
    if(err){
      return next(err);
    }
    bcrypt.hash(user.passWord,salt,function (err,hash) {
      if(err){
        return next(err);
      }
      user.passWord = hash;
      next();
    });
  });
});

userSchema.statics = {
  fetch: function(cb){
    return this.find({}).sort('meta.updateAt').exec(cb);
  },
  findById: function(id,cb){
    return this.findOne({_id: id}).exec(cb);
  }
};

userSchema.methods = {
  comparePassWord: function(_password,cb){
    bcrypt.compare(_password,this.passWord,function(err,inMatch){
      if(err){
        return cb(err);
      }
      cb(null,inMatch);
    });
  }
};

module.exports = userSchema;

