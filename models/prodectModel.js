const mongoose = require("mongoose");
// 1- Create Schema
const ProdectSchema = new mongoose.Schema({
   
    title: {
        type: String,
        required : true,
        trim : true,
        minlength: [3, 'too short prodect title'],
        mixlentgh: [ 100, 'Too long prodect title'],
    }, 

    slug: {
    type: String,
    required: true,
    lowercase: true,
    },

    description: {
        type: String,
        required : [true, "product description is required"],
        minlength: [20, "too short  descripion"]
    },

    //How Match prodect
    quantity: {
        type: Number,
        required :  [true, "product quantity is required"],
    },

    //How many sold Prodect
    sold: {
        type: Number,
        default : 0,
    },

    price:{
     type: Number,
     required :  [true, "product price is required"],
     trim : true,
     max: [ 200000, 'Too long prodect price'],
    },

    priceAfterDescount:{
        type: Number,
    },

    colors: [String],

    imageCover:{
    type : String,
    required :  [true, "product cover Image is required"],
   },

    images: [String],
  
    reviews: [
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            name: {
                type: String,
                required:true
            },
            rating: {
                type: Number,
                required: true
            },
            comment:{
                type: String,
                required: true
            }
        }
    ],

    category: {
        type: String,
        ref: 'Category',
        required:[true, 'Prodect must be cover to category'],
    },


    subcategory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subcategries',
            required:[true, 'Prodect must be belong to category'], 
        },
    ],


    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    //  التقيم
    ratinggsAverage: {
        type: Number,
        min: [1, 'Rating must be above or equal 1.0'],
        max: [5, 'Rating must be above or equal 5.0']
    },

  
    

  },

  {timestamps: true}
  
  );

  ProdectSchema.pre(/^find/ , function(next){
    this.populate({
        path: "category",
        select : 'name -_id',
    });
    next();
  });
  
  // 2- Create Models
  const prodectModels = mongoose.model('prodect', ProdectSchema);
  


 module.exports = prodectModels;  