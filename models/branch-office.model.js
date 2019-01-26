const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const personSchema = require('./schemas/person.schema');

let branchOffice = {
    name: { type: String, index: true },
    business: { type: Schema.Types.ObjectId, ref: 'business' },
    person: personSchema,
    dropped: { type: Date }
};

let branchOfficeSchema = new Schema(branchOffice, { timestamps: { createdAt: 'created_at' } });

let branchOfficeModel = mongoose.model('BranchOffice', branchOfficeSchema, 'branchOffices');

module.exports = branchOfficeModel;