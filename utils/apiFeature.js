const prodectModels = require("../models/prodectModel");

class ApiFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    search(){
      const keyword = this.queryString.keyword ? {
         title: {
            $regex: this.queryString.keyword,
            $options: 'i'
         }
      } : {}
      console.log(keyword);
      this.query = this.query.find({...keyword});
      return this
    }



    filter(){
        
      //ثم سيقوم بحذف الحقول pageb و sortو limitو fieldsمن كائن الاستعلام، وسيتم إنشاء كائن الاستعلام الجديد التالي:
      // //http://localhost:3000/api/v1/prodect?ratingQuantity=0&price=55.99
     // 1- filtring
  
      const queryStringObject = { ...this.queryString};
      const excludesFieldeds =  ['page', 'sort', 'limit', 'keyword'];
      excludesFieldeds.forEach(field => delete queryStringObject[field]);
      this.query = this.query.find(queryStringObject);
   
      // add $ before price 
      let queryStr = JSON.stringify(queryStringObject);
     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
     this.query = this.query.find(JSON.parse(queryStr));
       return this;
      }
      pagination(resPerpage){
         const currentPage = Number(this.queryString.page) || 1;
         const skip = resPerpage * (currentPage - 1);

         this.query = this.query.limit(resPerpage).skip(skip);
         return this;
      }
  
   }





    /*filter(){
        
    //ثم سيقوم بحذف الحقول pageb و sortو limitو fieldsمن كائن الاستعلام، وسيتم إنشاء كائن الاستعلام الجديد التالي:
    // //http://localhost:3000/api/v1/prodect?ratingQuantity=0&price=55.99
   // 1- filtring

    const queryStringObject = { ...this.queryString};
    const excludesFieldeds=  ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludesFieldeds.forEach((field) => delete queryStringObject[field]);

    // add $ before price 
    let queryStr = JSON.stringify(queryStringObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
     this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

     return this

    }

    sort(){
            //sorting لجلب الاكثر مبيعا او الاقل سعرا بالترتيب
    //http://localhost:3000/api/v1/prodect?sort=-sold,price
     if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.mongooseQuery = this.mongooseQuery.sort(sortBy);
     }else{
        this.mongooseQuery = this.mongooseQuery.sort('-createAt');
     }
       return this;
    }


    limitFields(){
              // 4- fields
      // عندما يريد front end ان يعرض حاجه معينه فقط مثل title
      //http://localhost:3000/api/v1/prodect?fields=title,ratingQuantity
      // لو عايز كل حاجه ترجع ماعدا شي واحد مثل title price
      //http://localhost:3000/api/v1/prodect?fields=-title-price
     if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.mongooseQuery = this.mongooseQuery.select(fields);
     } else{
        this.mongooseQuery = this.mongooseQuery.select('-__v')
     };
      return this;
    }


    search(modelName){
          // 5- search
     if(this.queryString.keyword){
        let query = {};

        if (modelName === "prodect") {
            query.$or = [
                {title: {$regex: this.queryString.keyword, $options: 'i'} },
                {description: {$regex:this.queryString.keyword, $options: 'i'} },
            ];
        } else {
            query = {name : { $regex:this.queryString.keyword, $options: 'i'}}
        }
      
        this.mongooseQuery = this.mongooseQuery.find(query)
     } 
     return this;
  
    }

    paginate(countDocuments) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;
    
        // Pagination result
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);
    
        // next page
        if (endIndex < countDocuments) {
          pagination.next = page + 1;
        }
        if (skip > 0) {
          pagination.prev = page - 1;
        }
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    
        this.paginationResult = pagination;
        return this;
      }
    
}*/



module.exports = ApiFeatures