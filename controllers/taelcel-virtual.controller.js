const handler = require('../utils/handler');
const status = require('http-status');

let _virtualTaelcel;
let _virtualLogTaelcel;
const getTaelcel = (req, res) => {
    
    const { _id } = req.params;
    let query = {
        _id: _id
    }
    _virtualTaelcel.findOne(query).
        exec(handler.handleOne.bind(null, 'Virtual', res));
};


const entryVirtual = (req, res) => {
    const { _id } = req.params;
    const _peticion = req.body;
    const query = { _id: _id };

    _virtualTaelcel.findOne(query, function (err, virtualBefore) {
        if (err)
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
        if (!virtualBefore) {
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, { message: "Bolsa no encontrada" });
        }
        _virtualTaelcel.findOneAndUpdate(query, { $inc: { taelcelTopUp: _peticion.TopUp, taelcelService: _peticion.Service } }
            , { new: true }, function (err, virtual) {
                if (err)
                    return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
                if (!virtual) {
                    return handler.handleError(res, status.INTERNAL_SERVER_ERROR, { message: "Bolsa no encontrada" });
                }
                _virtualLogTaelcel.create({
                    movement: "Ingreso",
                    registerDate: new Date(),
                    user: _peticion.User,
                    bag:_id,
                    reference: _peticion.Reference,
                    beforeTaelcelTopUp: virtualBefore.taelcelTopUp,
                    currentTaelcelTopUp: virtual.taelcelTopUp,
                    beforeTaelcelService: virtualBefore.taelcelService,
                    currentTaelcelService: virtual.taelcelService,
                }, function (err, log) {
                    if (err)
                        return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
                    res.json({ "Entry": log });
                });
            });
    });
};

module.exports = (virtualTaelcel, virtualLogTaelcel) => {
    _virtualTaelcel = virtualTaelcel;
    _virtualLogTaelcel = virtualLogTaelcel;

    return ({
        getTaelcel,
        entryVirtual
    })
}