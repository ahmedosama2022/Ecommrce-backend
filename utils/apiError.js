

class ApiError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`. startsWith(4) ? 'fail' : 'error';
        this.isOperational = true;
    }
}

module.exports = ApiError;
/*

class ErrorHandeler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
       Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ErrorHandeler;*/



