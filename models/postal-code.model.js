let mongoose = require('mongoose');
const Schema = mongoose.Schema;

let postalCodeSchema = {
    code: { type: Number, index: true },
    codeState: { type: Number },
    state: {
        code: { type: Number },
        name: { type: String }
    },
    city: {
        code: { type: Number },
        name: { type: String }
    },
    neighborhoods: [{
        name: { type: String },
        type: { type: String }
    }]
};

let postalCodeModel = mongoose.model('PostalCode', postalCodeSchema, 'postalCodes');

module.exports = postalCodeModel;