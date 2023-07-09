
const Order = require('../models/order');
const catchAsyncError = require('../maddilewares/catchAsyncError');
const ApiError = require('../utils/apiError')
const product = require('../models/prodectModel');
const prodectModels = require('../models/prodectModel');

// Create a new order  =>   /api/v1/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const{
        shippingInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingprice,
        totalprice,
        paymentInfo  
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingprice,
        totalprice,
        paymentInfo ,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        succes: true,
        order
    })
})



exports.getSingleOrder  = catchAsyncError( async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
        //return res.status(404).json({msg: `no caetogry for this id ${id}`})
        return next(new ApiError("no order for this id ", 404))
    }
    res.status(200).json({
        success: true,
        order
    })
})


exports.myorders  = catchAsyncError( async (req, res, next) => {
    const order = await Order.find({user: req.user.id});
   
    res.status(200).json({
        success: true,
        order
    })
})







// Get all orders => /api/v1/admin/orders/

exports.allorders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find()

    let totelAmount  = 0;
    orders.forEach(order => {
        totelAmount += order.totalprice
    })

    res.status(200).json({
        success: true,
        totelAmount,
        orders
    })
})



// ubdate / process order - ADMIN => /api/v1/admin/orders/

exports.updateorders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.findById(req.params.id);
  
    if (orders && orders.orderstatus) {
      if (orders.orderstatus === 'Delivered') {
        return next(new ApiError('you have already delivered this order', 400));
      }
  
      orders.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity);
      });
  
      orders.orderstatus = req.body.status;
      orders.deliverdAt = Date.now();
  
      await orders.save();
      res.status(200).json({
        success: true,
      });
    } else {
      return next(new ApiError('Order not found', 404));
    }
  });



async function updateStock(id, quantity){
    const produc =  await prodectModels.findById(id);

    produc.stock = produc.stock - quantity;

    await produc.save({ validateBeforeSave: false})
}



exports.deleteorder  = catchAsyncError(async (req, res,next) => {
    const {id} = req.params;
    
    const Product = await Order.findByIdAndDelete(id);
    if (!Product) next(new ApiError("no prodect for this id ", 404))
    res.status(204).send();
})
