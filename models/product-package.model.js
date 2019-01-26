const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productPackageSchema = {
    name: { type: String },
    business: { type: Schema.Types.ObjectId, ref: 'Business' },
    dropped: { type: Date }
};

let productPackageModel = mongoose.model('ProductPackage', productPackageSchema, 'productPackages');

module.exports = productPackageModel;