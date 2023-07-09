//لاستدعاء مكتبه Express
const express = require("express");
const app = express();

//هذا الكود يستخدم لتحميل ملف .env
const devenv = require('dotenv');
//Morgan req res هي وسيلة تسجيل لتطبيقات
const morgan = require('morgan');
//استداعاء ملف config.env 
devenv.config({path: 'config.env'});
//استدعاء ملف الايرور
const ApiError = require('./utils/apiError')
const cookieparser = require('cookie-parser')
const globalError = require('./maddilewares/errorMiddleware')
const dbconnection = require('./config/dataBase');


const prodectRouts = require("./routsapi/prodectRouts ");
const authRouts = require("./routsapi/authRoute");
const orderRouts = require("./routsapi/orderRout");
dbconnection();


//middle Wares

app.use(globalError)
app.use(cookieparser())

//process.env.NODE_ENV tفي ملف config = developmentلو

app.use(express.json())
if (process.env.NODE_ENV = "development") {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`)
}




app.use('/api/v1', prodectRouts );
app.use('/api/v1', authRouts );
app.use('/api/v1', orderRouts );



const PORT = process.env.PORT;
const sever = app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);

});


process.on('uncaughtException', err => {
  console.log(` Error: ${err.stack}`)
  console.log('Shutting Down Down Due to uncaught exception')
  process.exit(1);
})



process.on('unhandledRejection', (err) => {
  console.error(`unhandledRejection Error: ${err.name} | ${err.message}`)
  sever.close(() => {
    process.exit(1);
  })
})















