let mongoose = require('mongoose');
const Schema = mongoose.Schema;

let taecelServiceSchema = {
    // name: { type: String, index: true }, 
    // business: { type: String },
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

let taecelServiceModel = mongoose.model('TaecelProduct', taecelServiceSchema, 'taecelProducts');

module.exports = taecelServiceModel;
