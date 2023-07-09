const {  check, body } = require('express-validator');
const validtormiddleware = require("../../maddilewares/validatormiddleware");
const slugify = require('slugify');


// chek if id  is true get validtormiddleware
exports.getBrandValidoter = [
    check('id').isMongoId().withMessage('Invald Brand id') ,
    validtormiddleware
];
// chek if , name is true get validtormiddleware
exports.CreateBrandValidoter = [
    check('name')
    .notEmpty()
    .withMessage('Brand required') 
    .isLength({min : 3})
    .withMessage('Too long Brand name')
    .isLength({max: 32})
    .withMessage('Too long Brand name')

    .custom((val, {req}) => {
    req.body.slug = slugify(val);
     return true;
    }),
    validtormiddleware
];
// chek if id  is true get validtormiddleware
exports.ubdateBrandValidoter = [
    check('id').isMongoId().withMessage('Invald Brand id') ,
    body('name')
    .custom((val, {req}) => {
    req.body.slug = slugify(val);
     return true;
    }),
    validtormiddleware
];
// chek if id  is true get validtormiddleware
exports.deletBrandValidoter = [
    check('id').isMongoId().withMessage('Invald Brand id') ,
    validtormiddleware
];
