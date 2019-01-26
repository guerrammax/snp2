/**
 * Models
 */

let mongoose = require('mongoose');
let _ = require('underscore');

module.exports = (wagner) => {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/qsp', { useMongoClient: true });

    // wagner.factory('db', () => mongoose);

    /**
     * Models imported
     */
    
    let Billing33Product = require('./billing33-product.model');    
    let Billing33Unit = require('./billing33-unit.model');    
    let BranchOffice = require('./branch-office.model');
    let Business = require('./business.model');
    let BusinessTemporal = require('./business-temporal.model');
    let Client = require('./client.model');
    let Configuration = require('./configuration.model');   
    let Image = require('./image.model');   
    let Product = require('./product.model');    
    let ProductBrand = require('./product-brand.model');
    let ProductCategory = require('./product-category.model');
    let ProductType = require('./product-type.model');
    let ProductUnit = require('./product-unit.model');
    let ProductPackage = require('./product-package.model'); 
    let PostalCode = require('./postal-code.model');  
    let Sale = require('./sale.model');
    let TaecelLog = require('./taecel-log.model')
    let TaecelSale = require('./taecel-sale.model');
    let User = require('./user.model');  
    let Folios=require('./internalFolio.model');
    let CFDIs=require('./cfdi.model');    
    let VirtualBags=require('./virtual-taelcel.model');
    let VirtualBagsLog=require('./virtual-taelcel-log.model');
    
    let models = { 
        Billing33Product,
        Billing33Unit,
        BranchOffice,
        Business,
        BusinessTemporal,
        Client,        
        Configuration,
        Image,
        Folios,
        Product,
        ProductBrand,
        ProductCategory,
        ProductType,
        ProductUnit,
        ProductPackage,
        PostalCode,
        Sale,
        TaecelLog,
        TaecelSale,
        User,
        CFDIs,
        VirtualBags,
        VirtualBagsLog
       
    };

    /**
     * Models in wagner
     */
    _.each(models, (v, k) => {                
        wagner.factory(k, () => v);
    });

}