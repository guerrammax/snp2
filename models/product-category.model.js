const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productCategorySchema = {
    name: { type: String },
    business: { type: Schema.Types.ObjectId, ref: 'Business' },
    dropped: { type: Date }
};

let productCategoryModel = mongoose.model('ProductCategory', productCategorySchema, 'productCategories');

module.exports = productCategoryModel;