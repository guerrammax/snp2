const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productUnitSchema = {
    name: { type: String },
    abbreviate: { type: String },    
    billing33: { type: String, default:'87'},
    business: { type: Schema.Types.ObjectId, ref: 'Business' },
    dropped: { type: Date }
};

let productUnitModel = mongoose.model('ProductUnit', productUnitSchema, 'productUnits');

module.exports = productUnitModel;