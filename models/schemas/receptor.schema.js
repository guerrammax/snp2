
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let addressSchema = require('./address.schema');

let receptor = {
    type: { type: String },
    rfc: { type: String },
    rs: { type: String },
    email: { type: String },
    taxRegimen:{type:String},
    address: addressSchema
}
const receptorSchema = new Schema(receptor, { strict: true });

module.exports = receptorSchema;