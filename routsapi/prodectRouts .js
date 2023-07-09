/*const express = require("express");

const {getProductValidator ,createProductValidator, updateProductValidator, deleteProductValidator } = require("../utils/validators/brodectValidator")
const {getBrodects, createBrodect ,getBrodect, ubdateBrodect, deleteBrodect} = require('../services/prodectService')
const router = express.Router();

const subCategoryRout = require("./subCategoryRoute");
router.use('/:categoryId/subCategries', subCategoryRout);
router
.route('/')
.get(getBrodects)
.post(createProductValidator,createBrodect);
router
.route('/:id')
.get( getProductValidator,getBrodect)
.put( updateProductValidator,ubdateBrodect)
.delete(deleteProductValidator,deleteBrodect);


module.exports = router;*/

const express = require('express')

const router = express.Router();

const {getProdects ,newProduct, getSingleProduct,deleteReviews,getProdectsReviews, ubdateProduct, deleteProduct, createproductReview} = require("../services/prodectService")
const {isAuthenticateduser, authhorzeRoles} = require('../maddilewares/auth')



router.route('/prodect').get(getProdects)



router.route('/prodect/:id').get(getSingleProduct),

router.route('/admin/prodect/new').post(isAuthenticateduser,newProduct),


router.route('/admin/prodect/:id')
.put(isAuthenticateduser,authhorzeRoles('admin'),ubdateProduct)
.delete(isAuthenticateduser,authhorzeRoles('admin'),deleteProduct),


router.route('/review').put(isAuthenticateduser,createproductReview),
router.route('/reviews').get(isAuthenticateduser,getProdectsReviews),
router.route('/reviews').delete(isAuthenticateduser,deleteReviews),
module.exports = router;