const CFDI = require('../models/cfdi.model');


//         Usuario:'',
//         Contrasenia:'',
//         IdServicio:''
//         Xml:'' 
//         Billing:


const setStamp = (req, res) => {
    let data = req.body;
    let args = {
        usuario: data.Usuario,
        contrasenia: dataContrasenia,
        idServicio: data.IdServicio,
        xml: data.XML
    }


    let {isProduction} = req.query;
    let url = isProduction ? URLPROD : URLTEST;
    let Billing = data.Billing;

    if (isProduction) {
        return handler.handleError(res, status.INTERNAL_SERVER_ERROR, { message: "Facturacion en modo Production" });
    }

    soap.createClient(url, function (err, client) {
        if (err)
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
        if (!client) {
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, { message: "No es posible conectarse con el Servicio de Facture Hoy " });
        }
        client.EmitirTimbrar(data, function (err, result) {
            if (err)
                return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
            if (result.return.isError) {
                return handler.handleError(res, status.INTERNAL_SERVER_ERROR, {
                    message:
                    "Código de error:" + result.return.codigoError + " Descripción:" + result.return.message
                });
            }


            Billing.response={
                fechaTimbrado: result.return.fechaHoraTimbrado,                
                selloSAT: result.return.selloDigitalTimbreSAT,
                selloCFD:result.return.selloDigitalEmisor,
                UUID: result.return.folioUDDI,
                cadenaOriginal: result.return.cadenaOriginal,
                cadenaOriginalTImbre:result.return.cadenaOriginalTimbre,
                urlPDF:result.return.rutaDescargaPDF,
                urlXML:result.return.rutaDescargaXML,
                xml:result.return.XML
            };

            CFDI.create(Billing, function (err, _created) {
                if (err)
                    return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
                res.json({ cfdi: _created });
            });            
        });

    });
}

module.exports = () => {
    return ({
        setStamp
    });
}

