const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let taecelLog = {
    // quantity: { type: Number },
    // payment: { type: String },
    // reference: { type: String },
    // business: { type: Schema.Types.ObjectId, ref: 'Business' },
    // user: { type: Schema.ObjectId, ref: 'User' }

    topUp: { type: Number },
    service: { type: Number },
    payment: { type: String },
    reference: { type: String },
    business: { type: Schema.Types.ObjectId, ref: 'Business' },
    user: { type: Schema.ObjectId, ref: 'User' }
};

let taecelLogSchema = new Schema(taecelLog, { timestamps: { createdAt: 'created_at' } });

let taecelLogModel = mongoose.model('TaecelLog', taecelLogSchema, 'taecelLogs');

module.exports = taecelLogModel;