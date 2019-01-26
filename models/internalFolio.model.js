const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let internalFolioSchema = {
    business: { type: Schema.Types.ObjectId, ref: 'Business' },
    serie: { type: String,required:true, minlength:1},
    start: { type: Number,required:true},
    end:{type: Number,required:true,validate:[endValidator,'Must be more than start']},
    current:{type: Number,required:true, validate:[currentValidator,'Must be between End and Start']},
    default:{type: Boolean,required:true,default:false},
    dropped: { type: Date }
};

function endValidator(value){
    return value>this.start
}


function currentValidator(value){
    return this.end>=value>=this.start
}
let internalFolioModel = mongoose.model('Folios', internalFolioSchema, 'internalFolio');

module.exports = internalFolioModel;