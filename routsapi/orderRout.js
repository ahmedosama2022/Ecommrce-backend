const express = require('express')
const router = express.Router();
const {newOrder, myorders, getSingleOrder,allorders ,updateorders, deleteorder} = require("../services/orderservice")
const {isAuthenticateduser, authhorzeRoles} = require('../maddilewares/auth')



router.route('/order/new').post(isAuthenticateduser, newOrder)
router.route('/order/:id').get(isAuthenticateduser, getSingleOrder)
router.route('/orders').get(isAuthenticateduser, myorders)
router.route('/admin/orders').get(isAuthenticateduser, allorders)
router.route('/admin/orders/:id').put(isAuthenticateduser, updateorders)
router.route('/admin/orders/:id').delete(isAuthenticateduser, deleteorder)
module.exports = router;