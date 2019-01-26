const handler = require('../utils/handler');
const status = require('http-status');
const SOAP = require('soap');
const BASE64 = require('base-64');
const UTF8 = require('utf8');
const URLTEST = "http://pruebasclientes.facturehoy.com:8080/CFDI33/WsEmisionTimbrado33?wsdl";
//const URLPROD = "http://pruebasclientes.facturehoy.com:8080/CFDI33/WsEmisionTimbrado33?wsdl";
const URLPROD = "http://wsprod3.facturehoy.com/CFDI33/WsEmisionTimbrado33?wsdl";



let _cfdi;

const getAll = (req, res) => {
    const { _id } = req.params;
    let { from } = req.query;
    let { to } = req.query;
    let { isPublic } = req.query;

    let _fromDate;
    let _toDate;
    let query;

    if (!from && !to) {
        if (!isPublic) {
            query = {
                business: _id
            }
        }
        else {
            query = (isPublic == "true" ? {
                business: _id,
                publicoGral: true
            } : {
                    business: _id,
                    publicoGral: false
                });
        }
    }
    else {
        if (!to) {
            _fromDate = new Date(from);
            _toDate = new Date(from);
            _toDate.setDate(_fromDate.getDate() + 1);
        } else {
            _fromDate = new Date(from);
            _toDate = new Date(to);
            _toDate.setDate(_toDate.getDate() + 1)
        }
        if (!isPublic) {
            query = {
                business: _id,
                "response.fechaTimbrado": { $gte: _fromDate, $lt: _toDate }
            }
        } else {
            query =
                (isPublic == "true" ? {
                    business: _id,
                    "response.fechaTimbrado": { $gte: _fromDate, $lt: _toDate },
                    publicoGral: true
                } : {
                        business: _id,
                        "response.fechaTimbrado": { $gte: _fromDate, $lt: _toDate },
                        publicoGral: false
                    });
        }
    }
    _cfdi.find(query).sort({"response.fechaTimbrado":-1}).exec(handler.handleMany.bind(null, "cfdis", res));

};

const getPublic = (req, res) => {
    const { _id } = req.params;

    let query = {
        business: _id,
        publicoGral: true
    }
    _cfdi.find(query).exec(handler.handleMany.bind(null, "cfdis", res));
};

const getCustomer = (req, res) => {
    const { _id } = req.params;

    let query = {
        business: _id,
        publicoGral: false
    }
    _cfdi.find(query).exec(handler.handleMany.bind(null, "cfdis", res));
};

const getAllCanceled = (req, res) => {
    const { _id } = req.params;
    let { from } = req.query;
    let { to } = req.query;
    let { isPublic } = req.query;

    let _fromDate;
    let _toDate;
    let query;
    
    if (!from && !to) {        
        if (!isPublic) {
            query = {
                business: _id,
                dropped: { $exists: true }
            }
        }
        else {
            query = (isPublic == "true" ? {
                business: _id,
                publicoGral: true,
                dropped: { $exists: true }
            } : {
                    business: _id,
                    publicoGral: false,
                    dropped: { $exists: true }
                });
        }
    }
    else {        
        if (!to) {
            _fromDate = new Date(from);
            _toDate = new Date(from);
            _toDate.setDate(_fromDate.getDate() + 1);
        } else {            
            _fromDate = new Date(from);
            _toDate = new Date(to);
            _toDate.setDate(_toDate.getDate() + 1)
        }

        
        if (!isPublic) {            
            query = {
                business: _id,
                dropped: { $gte: _fromDate, $lt: _toDate },
                //dropped: { $exists: true, $gte: _fromDate, $lt: _toDate }
            }             
        } else {
            query =
                (isPublic == "true" ? {
                    business: _id,
                    dropped: { $gte: _fromDate, $lt: _toDate },
                    publicoGral: true,
                    //dropped: { $exists: true }
                } : {
                        business: _id,
                        dropped: { $gte: _fromDate, $lt: _toDate },
                        publicoGral: false,
                        //dropped: { $exists: true }
                    });
        }
    }

    _cfdi.find(query).sort({"response.fechaTimbrado":-1}).exec(handler.handleMany.bind(null, "cfdis", res));


    // const { _id } = req.params;
    // let query = {
    //     business: _id
    //     , dropped: { $exists: true }
    // }
    // _cfdi.find(query).exec(handler.handleMany.bind(null, "cfdis", res));
}

const getCanceledPublic = (req, res) => {
    const { _id } = req.params;
    let query = {
        business: _id
        , dropped: { $exists: true }
        , publicoGral: true
    }
    _cfdi.find(query).exec(handler.handleMany.bind(null, "cfdis", res));
}

const getCanceledCustomer = (req, res) => {
    const { _id } = req.params;
    let query = {
        business: _id
        , dropped: { $exists: true }
        , publicoGral: false
    }
    _cfdi.find(query).exec(handler.handleMany.bind(null, "cfdis", res));
}
const getById = (req, res) => {
    const { _id } = req.params;

    let query = {
        _id: _id
    }
    _cfdi.find(query).exec(handler.handleOne.bind(null, "cfdi", res));
};

const create = (req, res) => {
    let _obj = req.body;
    _obj.business = req.params._id;

    _cfdi.create(_obj, (err, _created) => {
        if (err)
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
        res.json({ cfdi: _created });
    });
}


const update = (req, res) => {
    const { _id } = req.params;
    const _obj = req.body;
    const query = { _id: _id };

    _cfdi.findOneAndUpdate(query, _obj, { new: true })
        .exec(handler.handleOne.bind(null, 'cfdi', res));
}


const remove = (req, res) => {
    const { _id } = req.params;
    const query = { _id: _id };

    _cfdi.findOneAndUpdate(query, { dropped: new Date() }, { new: true })
        .exec(handler.handleOne.bind(null, 'cfdi', res));
}



const setStamp = (req, res) => {
    let data = req.body;

    var bytes = UTF8.encode(data.XML);

    var encoded = BASE64.encode(bytes);

    
    let args = {
        usuario: data.Usuario,
        contrasenia: data.Contrasenia,
        idServicio: data.IdServicio,
        xml: encoded
    }

    let {isProduction} = req.query;
    let url = isProduction == 'true' ? URLPROD : URLTEST;
    let Billing = data.Billing;

    if (isProduction == 'true') {
        return handler.handleError(res, status.INTERNAL_SERVER_ERROR, { message: "Facturacion en modo Production" });
    }

    SOAP.createClient(url, function (err, client) {
        if (err)
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
        if (!client) {
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, { message: "No es posible conectarse con el Servicio de Facture Hoy " });
        }
        client.EmitirTimbrar(args, function (err, result) {
            if (err)
                return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
            if (result.return.isError) {
                return handler.handleError(res, status.INTERNAL_SERVER_ERROR, {
                    message:
                    "Código de error:" + result.return.codigoError + " Descripción:" + result.return.message
                });
            }


            Billing.response = {
                fechaTimbrado: result.return.fechaHoraTimbrado,
                selloSAT: result.return.selloDigitalTimbreSAT,
                selloCFD: result.return.selloDigitalEmisor,
                UUID: result.return.folioUDDI,
                cadenaOriginal: result.return.cadenaOriginal,
                cadenaOriginalTImbre: result.return.cadenaOriginalTimbre,
                urlPDF: result.return.rutaDescargaPDF,
                urlXML: result.return.rutaDescargaXML,
                xml: result.return.XML
            };

            _cfdi.create(Billing, function (err, _created) {
                if (err)
                    return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
                res.json({
                    cfdi: {
                        "_id": _created._id,
                        "PDF": result.return.rutaDescargaPDF,
                        "XML": result.return.rutaDescargaXML
                    }
                });
            });
        });

    });
}


module.exports = (CFDIs) => {
    _cfdi = CFDIs;
    return ({
        getAll,
        getPublic,
        getCustomer,
        getAllCanceled,
        getCanceledPublic,
        getCanceledCustomer,
        getById,
        create,
        update,
        remove,
        setStamp
    });
}