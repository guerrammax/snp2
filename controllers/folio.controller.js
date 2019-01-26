const handler = require('../utils/handler');
const status = require('http-status');

let _folios;

const _sale = require('../models/sale.model');

const getAll = (req, res) => {
    //Id business
    const { _id } = req.params;

    let query = {
        business: _id
        , dropped: { $exists: false }
    }
    _folios.find(query).exec(handler.handleMany.bind(null, "series", res));
};

const getBilling = (req, res) => {
    const { _id } = req.params;
    const { sale } = req.query;
    let query =
        {
            business: _id,
            default: true,
            //$expr:{$lt:["$current","$end"]}
        }
    _folios.findOne(query, function (err, folio) {
        if (err) {
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
        }
        if (!folio) {
            var error = new Object();
            error.message = "No existen series disponibles";
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, error);
        }
        _sale.findOne({ _id: sale }).populate(
            {
                path: "client", model: "Client", select: "person.rfc"
            }).exec(function (err, sale) {
                if (err) {
                    return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
                }
                if (typeof sale.client !== 'undefined')
                    res.json({
                        "Serie": folio.serie,
                        "Folio": (folio.current + 1),
                        "RFC": sale.client.person.rfc
                    });
                else {
                    res.json({
                        "Serie": folio.serie,
                        "Folio": (folio.current + 1),
                        "RFC": "XAXX010101000"
                    });
                }
            });
    });
}
const getDefault = (req, res) => {
    //Id business
    const { _id } = req.params;

    let query = {
        business: _id,
        default: true
    }
    _folios.findOne(query).exec(handler.handleOne.bind(null, "serie", res));
}

const create = (req, res) => {

    let _obj = req.body;
    _obj.business = req.params._id;

    _folios.create(_obj, (err, _created) => {
        if (err)
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
        if (_created.default) {

            _folios.update({ _id: { $ne: _created._id } }, { $set: { default: false } }, { multi: true },
                function (err, folios) {
                    if (err)
                        return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
                    res.json({ "folio": _created });
                });
        }
        else {
               res.json({ "folio": _created });
        }     
    });    
}


const updateDefault = (req, res) => {
    //Id business
    const { _id } = req.params;
    const { serie } = req.query;

    const query = { business: _id };
    ///Id del documento
    const queryDefault = { _id: serie };

    _folios.update(query, { $set: { default: false } }, { multi: true }
        , function (err, folios) {
            if (err)
                return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
            _folios.findOneAndUpdate(queryDefault, { $set: { default: true } }, { new: true })
                .exec(handler.handleOne.bind(null, 'serie', res));
        }
    );
}

const update = (req, res) => {
    //Id del documento
    const { _id } = req.params;
    const _obj = req.body;

    const query = { _id: _id };

    _folios.findOneAndUpdate(query, _obj, { new: true }).exec(
        function (err, folio) {
            if (err)
                return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
            if (folio.default) {

                _folios.update({ _id: { $ne: _id } }, { $set: { default: false } }, { multi: true },
                    function (err, folios) {
                        if (err)
                            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
                        res.json({ "serie": folio });
                    });
            }
            else {
                res.json({ "serie": folio });
            }
        }
    )
    //.exec(handler.handleOne.bind(null, 'serie', res));
}


const remove = (req, res) => {
    //id del documento
    const { _id } = req.params;
    const query = { _id: _id };

    _folios.findOneAndUpdate(query, { dropped: new Date() }, { new: true })
        .exec(handler.handleOne.bind(null, 'serie', res));
}


module.exports = (Folios) => {
    _folios = Folios;
    return ({
        getAll,
        getDefault,
        getBilling,
        create,
        update,
        remove,
        updateDefault
    });
}