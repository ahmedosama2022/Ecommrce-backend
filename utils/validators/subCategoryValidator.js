const {  check, body } = require('express-validator');
const slugify = require('slugify');
const validtormiddleware = require("../../maddilewares/validatormiddleware")


// chek if id  is true get validtormiddleware
exports.getSubcategoryValidoter = [
    check('id').isMongoId().withMessage('Invald Subcategory id') ,
    validtormiddleware
];




// chek if , name is true get validtormiddleware
exports.CreateSubcategoryValidoter = [
    check('name')
    .notEmpty()
    .withMessage('SubCategory required') 
    .isLength({min : 2})
    .withMessage('Too long Subcategory name')
    .isLength({max: 32})
    .withMessage('Too long Subcategory name')
    .custom((val, {req}) => {
      req.body.slug = slugify(val);
       return true;
      }),
    check('category')
    .notEmpty()
    .withMessage('subCategory must be belong to category')
    .isMongoId()
    .withMessage("Invald category id format"),

    validtormiddleware
];



// chek if id  is true get validtormiddleware
exports.ubdateSubcategoryValidoter = [
    check('id').isMongoId().withMessage('Invald Subcategory id') ,
    body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    validtormiddleware
];


// chek if id  is true get validtormiddleware
exports.deletSubcategoryValidoter = [
  check('id').isMongoId().withMessage('Invald Subcategory id') ,
    validtormiddleware
];
