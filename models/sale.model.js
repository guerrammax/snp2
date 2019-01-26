const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = require('./schemas/product.schema');

let saleSchema = new Schema({
    products: [{
        product: productSchema,
        quantity: { type: Number }
    }],
    isBilling:{type: String,default:'0'},

    date: { type: Date },
    user: { type: Schema.ObjectId, ref: 'User' },
    type: { type: String },
    business: { type: Schema.Types.ObjectId, ref: 'Business' },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    payment: { type: Object },
    dropped: { type: Date }
},
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });


saleSchema.virtual('amountTotal').
    get(function () {
        var amount = 0;
        for (i = 0; i < this.products.length; i++) {
            amount += parseFloat(this.products[i].quantity * this.products[i].product.basePrice);
            console.log("AmountTotal-Por Producto");
            console.log(amount);
        }
        console.log("AmountTotal-FINAL");
        console.log(amount);
        console.log("--------");
        return amount;
    });

//Calculos para facturación con CFDI  
saleSchema.virtual('transferredTotal').
    get(function () {
        var transferred = 0;
        for (i = 0; i < this.products.length; i++) {
            //transferred += this.products[i].quantity * this.products[i].product.taxPrice;     
           
            //CFDI
            transferred += parseFloat(this.products[i].quantity * this.products[i].product.taxPrice.toFixed(2));

            
            console.log("transferredTotal-Por Producto");
            console.log(transferred);

        }
        console.log("Transferred Total-FINAL");
        console.log(transferred);
        console.log("------");
        return transferred;
    });


//Calculos para facturación a PUBLICO
saleSchema.virtual('transferredTotalPUBLIC').
    get(function () {
        var transferred = 0;
        for (i = 0; i < this.products.length; i++) {
            //transferred += this.products[i].quantity * this.products[i].product.taxPrice;     
           
            //CFDI
           //transferred += parseFloat(this.products[i].quantity * this.products[i].product.taxPrice.toFixed(2));

            //PUBLICO   
            transferred += parseFloat(this.products[i].quantity * this.products[i].product.taxPrice);
            console.log("transferredTotal-Por Producto");
            console.log(transferred);

        }
        console.log("Transferred Total-FINAL");
        console.log(transferred);
        console.log("------");
        return transferred;
    });    

saleSchema.virtual("withheldTotal").get(function () {
    return 0;
});



saleSchema.virtual('total')
    .get(function () {
        var total = 0;
        var subtotal = 0;
        for (i = 0; i < this.products.length; i++) {
            total += this.products[i].quantity * this.products[i].product.finalPrice;
            console.log("Total-Por producto");
            console.log(total);
        }
        console.log("Total-Final");
        console.log(total);
        return total;
    });


//SUBTOTAL PARA CFDI    
saleSchema.virtual('subTotal')
    .get(function () {
        var subtotal = 0;
        for (i = 0; i < this.products.length; i++) {
            var iva = 0;
            if (this.products[i].product.tax) {
                var iva = this.products[i].product.tax.iva ? this.products[i].product.tax.iva / 100 : 0
                console.log("IVA-Por producto");
                console.log(iva);
            }
            ////subtotal += this.products[i].quantity *(this.products[i].product.finalPrice - (this.products[i].product.finalPrice * iva));            
            //subtotal+=this.products[i].quantity*this.products[i].product.finalPrice/(1+iva);                         
            let sub = this.products[i].quantity * this.products[i].product.finalPrice / (1 + iva);
            console.log("SUB");
            console.log(sub);

     //PARA CFDI      
     subtotal += parseFloat(parseFloat(sub).toFixed(2));

            console.log("Subtotal-Por Producto");
            console.log(subtotal);
            console.log("-----");
           
            
        }
        console.log("Final-subtotal");
        console.log(subtotal);
        return subtotal;
    });

//SUBTOTAL PARA PUBLICO
saleSchema.virtual('subTotalPUBLIC')
    .get(function () {
        var subtotal = 0;
        for (i = 0; i < this.products.length; i++) {
            var iva = 0;
            if (this.products[i].product.tax) {
                var iva = this.products[i].product.tax.iva ? this.products[i].product.tax.iva / 100 : 0
                console.log("IVA-Por producto");
                console.log(iva);
            }
            ////subtotal += this.products[i].quantity *(this.products[i].product.finalPrice - (this.products[i].product.finalPrice * iva));            
            //subtotal+=this.products[i].quantity*this.products[i].product.finalPrice/(1+iva);                         
            let sub = this.products[i].quantity * this.products[i].product.finalPrice / (1 + iva);
            console.log("SUB");
            console.log(sub);


     //PARA PUBLICO
     subtotal += parseFloat(sub);
            console.log("Subtotal-Por Producto");
            console.log(subtotal);
            console.log("-----");
           
            
        }
        console.log("Final-subtotal");
        console.log(subtotal);
        return subtotal;
    });    


saleSchema.virtual("totalProductsIva").get(function () {
    var totalIva=0;
    var iva=0;
    this.products.forEach(function (item) {          
        if(item.product.tax && item.product.tax.iva && item.product.tax.iva!=0){                        
            
            totalIva+=parseFloat(item.quantity * item.product.basePrice);
            console.log("Cantidad de producto");
            console.log(item.quantity);
            console.log("Total iva-Por producto");
            console.log(totalIva);
        }
    });
    console.log("Final total IVA");
    console.log(totalIva);
    return totalIva;
});


saleSchema.path('products').schema.virtual('amount').get(function () {
    return this.quantity * this.product.basePrice;
    console.log("Cantidad de prod");
    console.log(this.quantity * this.product.basePrice);
})

saleSchema.path('products').schema.virtual('transferred').get(
    function () {
        return this.quantity * this.product.taxPrice;
        console.log("Transferido")
        console.log(this.quantity * this.product.taxPrice);
    }
)
saleSchema.path('products').schema.set('toObject', { virtuals: true })
saleSchema.path('products').schema.set('toJSON', { virtuals: true })

let saleModel = mongoose.model('Sale', saleSchema, 'sales');

module.exports = saleModel;




