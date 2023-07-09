// wrond mongoose object ID Errror
const ApiError = require("../utils/apiError")


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development"){
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack
    })
  }


  if (process.env.NODE_ENV === "production"){
    let error = { ...err }
    error.message = err.message

    res.status(error.statusCode).json({
      success:false,
      errors: err.stack || 'Internal server Error'
    })
  }

  if(errorMonitor.name === 'CastError'){
    const message = `resourse not found. Invalid: ${err.path}`
    error = new ApiError(message, 400)
  }
  
  // handling mongoose validation Error
  
  if(errorMonitor.name === 'validationError'){
    const message = Object.values(err.errors).map(value => value.message);
    error = new ApiError(message, 400)
  }
  if(err.code === 11000){
    const message = `Deplicate ${Object.keys(err.keyvalue)} endtered`
    error = new ApiError(message,400)
  }


  if(err.name === 'JsonWebTokenError'){
    const message = 'JSON web token is invalid. Try Again!!!'
    error = new ApiError(message,403)
  }
  
  res.status(error.statusCode).json({
    success: false,
    message: error.message || 'Internal server Error'
  })
}

