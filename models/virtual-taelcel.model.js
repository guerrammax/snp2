const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let virtual={
    taelcelTopUp:{type: Number, required:true},
    taelcelService:{type:Number, required:true},
    taelcelTopUpStock:{type: Number, required:true},
    taelcelServiceStock:{type:Number, required:true},
    registerDate:{type:Date}
}

let virtualModel=mongoose.model('VirtualBags',virtual,'virtualBags');
module.exports=virtualModel;