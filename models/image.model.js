const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let imageSchema = {
    image: { type: Schema.Types.String },
};

let userModel = mongoose.model('Image', imageSchema, 'images');

module.exports = userModel;