const {  check, body } = require('express-validator');
const validtormiddleware = require("../../maddilewares/validatormiddleware");
const slugify = require('slugify');
const User = require('../../models/userModel');

// chek if id  is true get validtormiddleware
exports.getuserValidoter = [
    check('id').isMongoId().withMessage('Invald user id') ,
    validtormiddleware
];
// chek if , name is true get validtormiddleware
exports.CreateuserValidoter = [
  check('name')
  .notEmpty()
  .withMessage('User required')
  .isLength({ min: 3 })
  .withMessage('Too short User name')
  .custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

check('email')
  .notEmpty()
  .withMessage('Email required')
  .isEmail()
  .withMessage('Invalid email address')
  .custom((val) =>
    User.findOne({ email: val }).then((user) => {
      if (user) {
        return Promise.reject(new Error('E-mail already in user'));
      }
    })
  ),

check('password')
  .notEmpty()
  .withMessage('Password required')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters')
  .custom((password, { req }) => {
    if (password !== req.body.passwordConfirm) {
      throw new Error('Password Confirmation incorrect');
    }
    return true;
  }),

check('passwordConfirm')
  .notEmpty()
  .withMessage('Password confirmation required'),

check('phone')
  .optional()
  .isMobilePhone(['ar-EG', 'ar-SA'])
  .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

check('profileImg').optional(),
check('role').optional(),


    validtormiddleware
];
// chek if id  is true get validtormiddleware
exports.ubdateuserValidoter = [
    check('id').isMongoId().withMessage('Invald user id') ,
    body('name')
    .custom((val, {req}) => {
    req.body.slug = slugify(val);
     return true;
    }),
    validtormiddleware
];
// chek if id  is true get validtormiddleware
exports.deletuserValidoter = [
    check('id').isMongoId().withMessage('Invald user id') ,
    validtormiddleware
];
