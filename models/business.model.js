const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addressSchema = require('./schemas/address.schema');
const receptorSchema = require('./schemas/receptor.schema');
const personSchema = require('./schemas/person.schema');

let business = {
    name: { type: String },
    person: personSchema,
    emisor: receptorSchema,
    address: addressSchema,
    taecelStock: {
        quantity: { type: Number },
    },
    taecelService: {
        quantity: { type: Number },
    },
    emailConfiguration: {
        host: { type: String },
        port: { type: Number },
        secure: { type: Boolean }, // true for 465, false for other ports
        auth: {
            user: { type: String },
            pass: { type: String }
        }
    },
    billingDataProvider: {
        user: { type: String },
        password: { type: String },
        serviceNumber: { type: String },
        certificateNumber:{type: String}
    },
    license: { type: Date },
    dropped: { type: Date },
    ticket:{
    //Header line
    h1:{type:String, default:''},
    h2:{type:String, default:''},
    h3:{type:String, default:''},
    h4:{type:String, default:''},
    h5:{type:String, default:''},
    //Footer Line
    f1:{type:String, default:''},
    f2:{type:String, default:''},
    f3:{type:String, default:''},
    f4:{type:String, default:''},
    f5:{type:String, default:''}
    }
};

let businessSchema = new Schema(business, { timestamps: { createdAt: 'created_at' } });
businessSchema.index({ '$**': 'text' });

let businessModel = mongoose.model('Business', businessSchema, 'businesses');

module.exports = businessModel;