const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let virtualLog={

    movement:{type:String,required:true },    
    registerDate:{type:Date},    
    bag:{type: Schema.Types.ObjectId, ref: 'VirtualBags' },
    user:{type: Schema.Types.ObjectId, ref: 'User' },
    reference:{type:String},

    beforeTaelcelTopUp:{type: Number, required:true},
    currentTaelcelTopUp:{type: Number, required:true},        
    beforeTaelcelService:{type: Number, required:true},
    currentTaelcelService:{type: Number, required:true},

}

let virtualModelLog=mongoose.model('VirtualBagsLog',virtualLog,'virtualBagsLog');
module.exports = virtualModelLog;