let mongoose=require('mongoose');

let billing33ProductsSchema = {
    code: { type: String },
    description: { type: String, index: true }
};

let billing33ProductsModel = mongoose.model('Billing33Product', billing33ProductsSchema, 'billing33products');

module.exports= billing33ProductsModel;