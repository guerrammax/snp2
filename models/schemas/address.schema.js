const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let address = {
    state: {
        code: { type: Number },
        name: { type: String }
    },
    city: {
        code: { type: Number },
        name: { type: String }
    },
    cp: { type: Number },
    neighborhood: {
        name: { type: String },
        type: { type: String }
    },
    address: { type: String },
    number: { type: String },
    number2: { type: String },
    reference: { type: String },
}

const addressSchema = new Schema(address, { strict: true });

module.exports = addressSchema;