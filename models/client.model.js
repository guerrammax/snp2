const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const receptorSchema = require('./schemas/receptor.schema');
const addressSchema = require('./schemas/address.schema');
const personSchema = require('./schemas/person.schema');

let clientSchema = {
    person: personSchema,
    receptor: [receptorSchema],
    address: addressSchema,
    business: { type: Schema.Types.ObjectId, ref: 'Business' },
    date: { type: Date },
    dropped: { type: Date }
}

let schema = new Schema(clientSchema);
schema.index({ '$**': 'text' });

let clientModel = mongoose.model('Client', schema, 'clients');

module.exports = clientModel;
