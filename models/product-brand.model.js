const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productBrandSchema = {
    name: { type: String },
    business: { type: Schema.Types.ObjectId, ref: 'Business' },
    dropped: { type: Date }
};

let productBrandModel = mongoose.model('ProductBrand', productBrandSchema, 'productBrands');

module.exports = productBrandModel;