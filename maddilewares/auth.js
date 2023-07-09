const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const catchAsyncError = require("./catchAsyncError");
const jwt = require ("jsonwebtoken")




exports.isAuthenticateduser = catchAsyncError(async ( req, res, next) => {
    const { token } = req.cookies
    if(!token){
        return next(new ApiError('login frist to access this resource', 401))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);
    next()
})


// Handling users roles
exports.authhorzeRoles = (...role) => {
    return (req, res, next) => {
        if(!role.includes(req.user.role)){
            return next(
            new ApiError(`Role (${req.user.role}) is not allowed to access this resource`,  403)
            )
        }
        next()
    }
}

