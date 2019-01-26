const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let person = {
    firstname: { type: String },
    lastname: { type: String },
    lastname2: { type: String },
    email: { type: String },
    phone: { type: String },
    personType:{type:String},
    rfc:{type:String},
    socialR:{type:String},
    gender: { type: String },
    date: { type: Date }
}

const personSchema = new Schema(person, { strict: true });

module.exports = personSchema;