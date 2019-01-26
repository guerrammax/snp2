const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let configurationSchema = {
    name: { type: String, index: true },
    value: { type: Schema.Types.Mixed },
};

let configurationModel = mongoose.model('Configuration', configurationSchema, 'configurations');

module.exports = configurationModel;