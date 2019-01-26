const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addressSchema = require('./schemas/address.schema');
const personSchema = require('./schemas/person.schema');

let businessTemporal = {
    name: { type: String },
    person: personSchema,
    address: addressSchema
};

let businessTemporalSchema = new Schema(businessTemporal, { timestamps: { createdAt: 'created_at' } });
let businessTemporalModel = mongoose.model('businessesTemporal', businessTemporalSchema, 'businessesTemporal');

module.exports = businessTemporalModel;

// ps --sort -rss -eo rss,pid,command | head