
//استدعاء مكتبه mongoose لربط قاعده البيانات
const mongoose = require("mongoose");


const dbconnection = () => {
    
//ربط connection with db in file config
mongoose
.connect(process.env.db_url)
.then((conn) => {
  console.log(`DataBase Connected : ${conn.connection.host}`);

}) 
.catch((err) => {
  console.error(`DataBase Error: ${err}`)
  process.exit(1);
})

}


module.exports = dbconnection;