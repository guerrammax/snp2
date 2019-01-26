const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let cfdiSchema = {        
    serie: { type: String },
    folio: { type: String },
    lugarExpedicion:{type:String},
    formaPago: { type: String },        
    metodoPago: { type: String , default:"PUE"},
    tipoComprobante:{type: String, default:'I'},
    moneda:{type:String,default:'MXN'},        
    sale: [{ type: Schema.ObjectId, ref: 'Sale' }],          
    publicoGral:{type:Boolean, default:false },
    fechaEmision: { type: Date},        
    //fechaCancelacion: { type: Date },                        
    emisor:{
        nombre:{type:String},
        regimenFiscal:{type:String},
        rfc:{type:String}        
    },
    receptor:{
        nombre:{type:String},
        rfc:{type:String},
        usoCFDI:{type:String}
    },
    response:{
        fechaTimbrado: { type: Date },        
        selloSAT: { type: String },
        selloCFD: { type: String },
        UUID: { type: String },
        cadenaOriginal: { type: String },
        cadenaOriginalTImbre: { type: String },
        urlPDF:{type:String},
        urlXML:{type:String},
        xml:{type:String}
    },    
    subTotal: { type: Number },    
    total: { type: Number },                       
    impuestoTraslados: { type: Number },
    impuestoRetenidos: { type: Number },            
    //enviado: { type: String },        
    codeXML: { type: String },        
    codePDF: { type: String },        
    business: { type: Schema.Types.ObjectId, ref: 'Business' },
    dropped: { type: Date }
};

let cfdiModel = mongoose.model('CFDIs', cfdiSchema, 'cfdis');
module.exports = cfdiModel;