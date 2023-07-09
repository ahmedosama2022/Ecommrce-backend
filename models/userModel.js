const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const validator = require('validator')

const crypto = require('crypto')
// 1- Create Schema
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required : [true, 'please enter your name'],
        maxLength: [ 30, 'your name cannot exceed 30 characters']
    }, 
   
   email: {
    type: String,
    required: [true, 'email required'],
    unique: true,
    validate: [validator.isEmail, 'please enter valid email address'], 
   },

   password: {
    type: String,
    required: [true ,'password required'],
    minlength: [6 , 'Too short Password'],
    select: false
   },

   avatar: {
    public_id: {
      type:String,
      required: true
    },
    url:{
      type: String,
      required: true
    }
   },

   role: {
    type: String,
    default: 'user',
   },

   createdAt:{
    type: Date,
    default: Date.now
   },
   resetpassewordToken: String,
   resetpasswordExpire: Date
  
  })

// Encryption password before saving user
  userSchema.pre('save', async function (next){
    if(!this.isModified('password')){
      next()
    }
    this.password = await bcrypt.hash(this.password, 10)
  })
  
   // compare user password
   userSchema.methods.comparepassword = async function(enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password)
   }


  // Return jwt token
  userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME
    });
  }



  //Generate password reset token
  userSchema.methods.getResetPasswordToken = function () {

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set to resetPasswordToken
    this.resetpassewordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // set token expire time
    this.resetpasswordExpire  = Date.now() + 30 * 60 * 1000


    return resetToken
  }


const User = mongoose.model('User', userSchema);

module.exports = User;