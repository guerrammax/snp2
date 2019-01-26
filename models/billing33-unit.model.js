let mongoose=require('mongoose');

let billing33UnitSchema = {
    code: { type: String },
    description: { type: String, index: true }
};

let billing33UnitModel = mongoose.model('Billing33Unit', billing33UnitSchema, 'billing33units');

module.exports= billing33UnitModel;