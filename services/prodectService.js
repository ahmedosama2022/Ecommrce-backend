const prodectModels = require('../models/prodectModel')
const catchAsyncErrors = require('../maddilewares/catchAsyncError')
const ApiError = require('../utils/apiError')
const ApiFeatures = require('../utils/apiFeature')




//@desc  get list of categories
//@route  gat api/v1/prodects
//@access  public
//exports.getBrodects = factory.getAllOne(prodectModels ,"prodect");
exports.getProdects = catchAsyncErrors(async(req, res, next) => {
    const resPerpage = 4;

    const productCount = await prodectModels.countDocuments()
  const apifeaturs = new ApiFeatures(prodectModels.find(), req.query) 
     .search()
     .filter()
     .pagination(resPerpage)
    const prodects = await apifeaturs.query;
    res.status(200).json ({
        success: true,
        productCount,
        prodects
    })
})



//@desc   get specific prodect by id
//@route  get api/v1/prodectes/:id
//@access public

//exports.getBrodect = factory.getOne(prodectModels)
exports.getSingleProduct  = catchAsyncErrors( async (req, res, next) => {
    const prodect = await prodectModels.findById(req.params.id);
    if (!prodect) {
        //return res.status(404).json({msg: `no caetogry for this id ${id}`})
        return next(new ApiError("no prodect for this id ", 404))
    }
    res.status(200).json({
        success: true,
         prodect
    })
})




// @desc create prodect
// @route  post   /api/v1/prodect
//@aces  private
//exports.createBrodect = factory.createOne(prodectModels);
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id;
    const prodect = await prodectModels.create(req.body);
    res.status(201).json({
        success: true,
        prodect
    })
})





//@desc   ubdate  specific prodect 
//@route  put api/v1/prodect/:id
//@access private
//exports.ubdateBrodect = factory.ubdateOne(prodectModels)

exports.ubdateProduct = catchAsyncErrors(async (req, res, next) => {
    const prodect = await prodectModels.findByIdAndUpdate(req.params.id, req.body,
    {new: true}
    );
    if (!prodect) next(new ApiError("no prodect for this id ", 404))
    res.status(200).json({
        success: true,
        prodect
    })
})





//@desc   Delete  specific prodect 
//@route  Delete api/v1/prodects/:id
//@access private
//exports.deleteBrodect = factory.deleteone(prodectModels)

exports.deleteProduct  = catchAsyncErrors(async (req, res,next) => {
    const {id} = req.params;
    
    const Product = await prodectModels.findByIdAndDelete(id);
    if (!Product) next(new ApiError("no prodect for this id ", 404))
    res.status(204).send();
})



//create new review =>  /api/v1/review
exports.createproductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const prodect = await prodectModels.findById(productId);

    const isReviewed = prodect.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if(isReviewed) {
        prodect.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()){
                review.comment=comment;
                review.rating=Number(rating);
            }
        });
    }else{
        prodect.reviews.push(review);
        prodect.numOfReviews = prodect.reviews.length
    }

    productId.rating = prodect.reviews.reduce((acc, item) => item.rating + acc, 0) / prodect.
    reviews.length

    await prodect.save({validateBeforeSave: false});

    res.status(200).json({
        success:true
    })
})


// Get product Reviews   =>   /api/v1/reviews

exports.getProdectsReviews = catchAsyncErrors(async(req, res, next) =>{
    const product = await prodectModels.findById(req.query.id);


    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})


// delete product Reviews   =>   /api/v1/reviews

exports.deleteReviews = catchAsyncErrors(async(req, res, next) =>{
    const product = await prodectModels.findById(req.query.productId);
     const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString())
      

     const numOfReviews = reviews.length;
     const rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

     await prodectModels.findByIdAndUpdate(req.query.productId,{
        reviews,
        rating,
        numOfReviews
     },{
        new: true,
        runValidators: true,
        useFindAndModify: false
     })
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})



/*exports.getAllOne = (prodectModels ,modelName = '') => asyncHandler (async(req, res, next) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const documentsCount = await prodectModels.countDocuments();
 const apiFeatures = new ApiFeatures(prodectModels.find(filter), req.query)
 .paginate(documentsCount)
 .sort()
 .filter()
 .search(modelName)
 .limitFields();
    const {mongooseQuery, paginationResult} = apiFeatures;
  const Product = await mongooseQuery;
      res.status(200).json({results : Product.length,paginationResult, data: brands});
});*/