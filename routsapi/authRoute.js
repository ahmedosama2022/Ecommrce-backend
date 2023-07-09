const express = require('express');
const { registerUser,
     loginUser, 
     logout, 
     forgetPassword,
      resetpassword ,
      getUserprofile,
      updateProfile, 
      updatePassword,
      allusers,
      getuserDetails,
      updateuser,
      deletuser
    } = require('../services/authService');
const {isAuthenticateduser , authhorzeRoles}  = require('../maddilewares/auth')
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser)
router.route('/password/forget').post(forgetPassword)
router.route('/password/reset/:token').get(resetpassword)
router.route('/logout').get(logout)
router.route('/me').get(isAuthenticateduser,getUserprofile)
router.route('/password/update').put(isAuthenticateduser,updatePassword)
router.route('/me/update').put(isAuthenticateduser,updateProfile)

router.route('/admin/users').get(isAuthenticateduser,authhorzeRoles('admin'), allusers)

router.route('/admin/user/:id')
.get(isAuthenticateduser,authhorzeRoles('admin'), getuserDetails)
.put(isAuthenticateduser,authhorzeRoles('admin'), updateuser)
.delete(isAuthenticateduser,authhorzeRoles('admin'), deletuser)
module.exports = router;
