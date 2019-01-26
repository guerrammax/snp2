let mongoose = require('mongoose');
const Schema = mongoose.Schema;

let taecelSaleSchema = {
    detail: { type: Object }, 
    business: { type: String, index: true },
    // person: {
    //     name: { type: String },
    //     lastname: { type: String },
    //     lastname2: { type: String },
    // },
    // taecel: {
    //     cash: { type: Number },
    //     services: { type: Number },
    // }
};

let taecelSaleModel = mongoose.model('TaecelSale', taecelSaleSchema, 'taecelSales');

module.exports = taecelSaleModel;
