const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = require('./schemas/product.schema');

const productModel = mongoose.model('Product', productSchema, 'products');

module.exports= productModel;