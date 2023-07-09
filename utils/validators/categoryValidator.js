const {  check,body } = require('express-validator');
const slugify = require('slugify');
const validtormiddleware = require("../../maddilewares/validatormiddleware")


// chek if id  is true get validtormiddleware
exports.getcategoryValidoter = [
    check('id').isMongoId().withMessage('Invald category id') ,
    validtormiddleware
];
// chek if , name is true get validtormiddleware
exports.CreatecategoryValidoter = [
    check('name')
    .notEmpty()
    .withMessage('Category required') 
    .isLength({min : 3})
    .withMessage('Too long category name')
    .isLength({max: 32})
    .withMessage('Too long category name')
    .custom((val, {req}) => {
    req.body.slug = slugify(val);
     return true;
    }),
    validtormiddleware
];
// chek if id  is true get validtormiddleware
exports.ubdatecategoryValidoter = [
    check('id').isMongoId().withMessage('Invald category id') ,
    body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    validtormiddleware
];
// chek if id  is true get validtormiddleware
exports.deletcategoryValidoter = [
    check('id').isMongoId().withMessage('Invald category id') ,
    validtormiddleware
];
