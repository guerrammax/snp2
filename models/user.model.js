const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const personSchema = require('./schemas/person.schema');

let userSchema = {
    user: { type: String },
    password: { type: String },
    email: { type: String },
    person: personSchema,
    business: { type: Schema.Types.ObjectId, ref: 'Business' },
    branchOffice: { type: Schema.Types.ObjectId, ref: 'BranchOffice' },
    control: { type: Boolean },
    dropped: { type: Date },
    virtualBag:{type: Schema.Types.ObjectId, ref: 'VirtualBags'}
};

let userModel = mongoose.model('User', userSchema, 'users');

module.exports = userModel;