const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productTypeSchema = {
    name: { type: String },
    billing: {
        billing33: {
            code: { type: String },
            unit: { type: String }
        }
    },
    business: { type: Schema.Types.ObjectId, ref: 'Business' },
    dropped: { type: Date }
};

let productTypeModel = mongoose.model('ProductType', productTypeSchema, 'productTypes');

module.exports = productTypeModel;