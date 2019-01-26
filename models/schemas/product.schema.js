const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let product = {
    code: { type: String },
    name: { type: String, index: 'text' },
    description: { type: String },
    brand: { type: String },
    min: { type: String },
    existence: { type: Number },
    expirationDays: { type: Number },
    tax: { type: Object },
    finalPrice: { type: Number },
    quantity: { type: Number },
    business: { type: Schema.Types.ObjectId, ref: 'Business' },
    productBrand: { type: Schema.Types.ObjectId, ref: 'ProductBrand' },
    productCategory: { type: Schema.Types.ObjectId, ref: 'ProductCategory' },
    billing33:{type:String, default:'01010101'},
    //productType: { type: Schema.Types.ObjectId, ref: 'ProductType' },
    productPackage: { type: Schema.Types.ObjectId, ref: 'ProductPackage' },
    productUnit: { type: Schema.Types.ObjectId, ref: 'ProductUnit' },
    detail: { type: Object },
    dropped: { type: Date }
};

const productSchema = new Schema(product, { strict: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true} 
});

productSchema.virtual("basePrice")
.get(function(){    
    var impuestos=0;        
    //if(typeof this.tax!=="undefined"){
    if(this.tax){
        impuestos=Object.values(this.tax).reduce(
            function(a,b){
                return a+b;
            },0
        );         
     }
     var base=isNaN(this.finalPrice)?0:this.finalPrice/(1.0+(impuestos/100));
    return base;
})

productSchema.virtual("taxPrice").
get(function(){    
    var taxP=this.finalPrice-this.basePrice;
    return isNaN(taxP)?0:taxP;
})
module.exports = productSchema;
