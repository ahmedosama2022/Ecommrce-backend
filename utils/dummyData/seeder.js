const fs = require('fs');
require('colors');
const dotenv = require('dotenv');
const prodect = require('../../models/prodectModel');
const dbconnection = require('../../config/dataBase');

dotenv.config({ path: '../../config.env' });

// connect to DB
dbconnection();

// Read data
const products = JSON.parse(fs.readFileSync('./prodects.json'));


// Insert data into DB
const insertData = async () => {
  try {
    await prodect.create(products);

    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await prodect.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};



// insert Data from db 
//  write cd utils/dummyData



// node seeder.js -d
if (process.argv[2] === '-i') { // conect data base
  insertData();
} else if (process.argv[2] === '-d') { // Delete data base
  destroyData();
}
