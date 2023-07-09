
const User = require('../models/userModel');
const catchAsyncError = require('../maddilewares/catchAsyncError');
const ApiError = require('../utils/apiError')
const sendEmail = require('../utils/sendEmail')
const sendToken = require('../utils/jwtToken')
const crypto = require('crypto');
const { send } = require('process');
// @desc    Signup
// @route   GET /api/v1/auth/signup
// @access  Public
/*exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 2- Generate token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});


*

exports.protect = asyncHandler(async (req, res, next) => {
    // 1) Check if token exist, if exist get
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(
        new ApiError(
          'You are not login, Please login to get access this route',
          401
        )
      );
    }
  
    // 2) Verify token (no change happens, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
    // 3) Check if user exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(
        new ApiError(
          'The user that belong to this token does no longer exist',
          401
        )
      );
    }
  
    // 4) Check if user change his password after token created
    if (currentUser.passwordChangedAt) {
      const passChangedTimestamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );
      // Password changed after token created (Error)
      if (passChangedTimestamp > decoded.iat) {
        return next(
          new ApiError(
            'User recently changed his password. please login again..',
            401
          )
        );
      }
    }
  
    req.user = currentUser;
    next();
  });*/



  exports.registerUser = catchAsyncError(async (req, res, next) => {
    const {name, email, password} = req.body;

    const user = await User.create({
      name,
      email,
      password,
      avatar:{
          public_id: '61b2a9d869d54640ca3d7293',
          url:'https://yt3.ggpht.com/pT1VRJHRZIIfY43etVFByhT3aJN4xaULymxZhiNnaJAwPqSIU7W68VO_nPeMKt1kq39K4esu-g=s176-c-k-c0x00ffffff-no-rj'
      }
    })
    sendToken(user, 200, res)
  })

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.loginUser = catchAsyncError(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exist & check if password is correct
  const {email, password} = req.body;

  if (!email || !password) {
    return next(new ApiError('Please enter email & password', 400));
  }

  //find user in dataBase
  const user = await User.findOne({email}).select('+password')
  if(!user){
    return next(new ApiError('invalid email & password', 401));
  }



  // checks if password is correct or not
  const ispasswordMatched = await user.comparepassword(password);
  if (!ispasswordMatched) {
    return next(new ApiError('in enter email & password', 401));
  }
  sendToken(user, 200, res)
});




// forget password   =>  api/h1/password/forget

exports.forgetPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email});

  if(!user){
    return next(new ApiError(' user not found with this email' , 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({validateBeforeSave: false})


  // cCreate reset password url

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/passeord/reset/${resetToken}`

  const message =  `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not 
  requsted this email, then ignore it`


  try {

    await sendEmail({
      email: user.email,
      subject: 'shopIT password Recovery',
      message
    })
    res.status(200).json({
      success :true,
      message: `Email sent to: ${user.email}`
    })
  } catch (error) {
    user.resetpassewordToken = undefined;
    user.resetpasswordExpire = undefined;


    await user.save({validateBeforeSave: false})

    return next(new ApiError(error.message, 500))
  }
})



// forget password   =>  api/h1/password/forget

exports.resetpassword = catchAsyncError(async (req, res, next) => {

  const resetpasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user = await User.findOne({
    resetpasswordToken,
    resetpasswordExpire:{ $gt: Date.now()},
  })

  if(!user){
    return next(new AppError("Invalid Token", 403))
  }


  if(req.body.password !== req.body.confirmpassword){
    return next(new ApiError('password does not match', 400))
  }

  //setup new pass

  user.password = req.body.password;
  user.resetpassewordToken = undefined;
  user.resetpasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res)
})


exports.logout = catchAsyncError(async (req, res ,next) => {
  res.cookie('token' , null , {
    expires: new Date(Date.now()),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    message: 'Logged out'
  })
})

// ubdate / change password   = >   /api/v1/password/ubdate
exports.updatePassword = catchAsyncError( async (req,res,next) => {
   
  const user = await User.findById(req.body.id).select('+password');


  const isMatched = await user.comparepassword(req.body.oldPassword)
  if(!isMatched){
    return next(new ApiError('old password is incorrect'));
  }
  user.password = req.body.password;
   await user.save();
   sendToken(user, 200, res)
})





// Get currently logged in user details =>  /api/v1/me

exports.getUserprofile = catchAsyncError(async(req,res,next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  })
})


// update user profile =>  /api/v1/me/update

exports.updateProfile = catchAsyncError(async (req,res,next) => {
  const newUserData ={
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }

  // Update avatar : TODO

  const user = await User.findByIdAndUpdate(req.user.id, newUserData ,{
    new: true,
    reunValidators: true,
    useFindAndModify: false
  })
  res.status(200).json({
    success: true,
  })
})


// Admin Routes

// Get all users  =>   /api/v1/admn/users

exports.allusers = catchAsyncError(async (res, req, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  })

})




// Get user details  =>  /api/admin/user/:id
exports.getuserDetails = catchAsyncError(async (req,res,next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ApiError(`user does not found with id: ${req.params.id}`))
  }

  res.status(200).json({
    success: true,
    user
  })
})


exports.updateuser = catchAsyncError(async (req,res,next) => {
  const newUserData ={
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }

  // Update avatar : TODO

  const user = await User.findByIdAndUpdate(req.params.id, newUserData ,{
    new: true,
    reunValidators: true,
    useFindAndModify: false
  })
  res.status(200).json({
    success: true,
  })
})




// Delet user  =>  /api/admin/user/:id

exports.deletuser  = catchAsyncError(async (req, res,next) => {
  const {id} = req.params;
  
  const user = await User.findByIdAndDelete(id);
  if (!user) next(new ApiError("no user for this id ", 404))
  res.status(204).send();
})