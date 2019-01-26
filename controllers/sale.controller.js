const handler = require('../utils/handler');
const status = require('http-status');

let _sale;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getByBusiness = (req, res) => {
    let { _id } = req.params;
    const { isPublic } = req.query;


    let query;


    if (!isPublic) {
        query = {
            business: _id
        }
    } else {
        query = isPublic == 'true' ?
            {
                business: _id,
                client: { $exists: false }
            } :
            {
                business: _id,
                client: { $exists: true }
            };
    }


    _sale.find(query).sort({date:-1})
        .exec(handler.handleMany.bind(null, 'sales', res));

};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getByDate = (req, res) => {
    let { _id } = req.params;
    let { from } = req.query;
    let { to } = req.query;

    if (!to) {
        let _fromDate = new Date(from);
        let _toDate = new Date(from);
        _toDate.setDate(_fromDate.getDate() + 1);
        let query = {
            business: _id,
            date: { $gte: _fromDate, $lt: _toDate }
        }
        _sale.find(query)
            .populate('user')
            .exec(handler.handleMany.bind(null, 'sales', res));
    } else {
        let _fromDate = new Date(from);
        let _toDate = new Date(to);
        _toDate.setDate(_toDate.getDate() + 1)
        let query = {
            business: _id,
            date: { $gte: _fromDate, $lt: _toDate }
        }
        _sale.find(query)
            .populate('user').sort({date:-1})
            .exec(handler.handleMany.bind(null, 'sales', res));

        // let query = {
        //     business: _id,
        //     $and: [{ date: { $gte: new Date(date1) } }, { date: { $lt: new Date(date2) } }]
        // }
        // _sale.find(query)
        //     .exec(handler.handleMany.bind(null, 'sales', res));
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */



const getById = (req, res) => {
    const { _id } = req.params;

    let query = {
        _id: _id
    }
    _sale.findOne(query).exec(handler.handleOne.bind(null, 'sale', res));
}

const getBillingById = (req, res) => {
    const { _id } = req.params;

    let query = {
        _id: _id
    }

    _sale.findOne(query)
        .populate({
            path: "business", model: "Business", select: "address.cp emisor"
        })
        .populate({
            path: "products.product.productUnit", model: "ProductUnit",
            select: "name billing33"
        })
        .populate({
            path: "client", model: "Client", select: 'person.rfc person.socialR person.personType'
        })
        .exec(function (err, obj) {
            if (err)
                return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

            if (!obj.business.emisor) {
                let error = {
                    message: "Los datos del emisor no han sido registrados"
                };
                return handler.handleError(res, status.INTERNAL_SERVER_ERROR, error);
            }

            var billing = new Object();
            billing.serie = "";
            billing.folio = "";
            billing.lugarExpedicion = obj.business.address.cp;
            billing.formaPago = "@FormaPago";
            billing.metodoPago = "PUE";
            billing.tipoComprobante = "I";
            billing.moneda = "MXN";
            billing.sale = [obj._id];
            billing.fechaEmision = new Date();

            billing.emisor = new Object();
            billing.emisor.nombre = obj.business.emisor.rs ? obj.business.emisor.rs : "";
            billing.emisor.regimenFiscal = obj.business.emisor.taxRegimen ? obj.business.emisor.taxRegimen : '';
            //typeof obj.business.emisor.taxRegimen !== 'undefined' ? obj.business.emisor.taxRegimen : '';
            billing.emisor.rfc = obj.business.emisor.rfc;

            billing.receptor = new Object();
            var concepts = "";
            var objSale = JSON.parse(JSON.stringify(obj));
            //if (typeof obj.client == 'undefined') {
            if (!obj.client) {
                billing.receptor.nombre = "PÚBLICO GENERAL";
                billing.receptor.rfc = "XAXX010101000";
                billing.receptor.usoCFDI = "P01";
                billing.publicoGral = true;

                // res.status(status.INTERNAL_SERVER_ERROR).json({status:500,message:"La venta no tiene asociado un cliente"});                
                concepts =
                    "<cfdi:Concepto Cantidad=\"1\" "
                    + "ClaveProdServ=\"01010101\" "
                    + "ClaveUnidad=\"ACT\" "
                    + "Descripcion=\"Venta\" "
                    + "Importe=\"" + parseFloat(objSale.amountTotal).toFixed(2) + "\" "
                    + "NoIdentificacion=\"01010101\" "
                    + "Unidad=\"ACT\" "
                    + "ValorUnitario=\"" + parseFloat(objSale.amountTotal).toFixed(2) + "\" >"
                    + (objSale.transferredTotal != 0 ?
                        "<cfdi:Impuestos>"
                        + "<cfdi:Traslados>"
                        + "<cfdi:Traslado Base=\"" + parseFloat(objSale.totalProductsIva).toFixed(2) + "\" "
                        + "Importe=\"" + parseFloat(obj.transferredTotal).toFixed(2) + "\" "
                        + "Impuesto=\"002\" TasaOCuota=\"0.1600\" TipoFactor=\"Tasa\" />"
                        + "</cfdi:Traslados>"
                        + "</cfdi:Impuestos>" : "")
                    + "</cfdi:Concepto>";
            }
            else {
                if (!obj.client.person.socialR || !obj.client.person.rfc) {
                    let error = {
                        message: "El cliente no cuenta con los datos de facturación"
                    };
                    return handler.handleError(res, status.INTERNAL_SERVER_ERROR, error);
                }

                if (!obj.payment) {
                    billing.formaPago = '01';
                }
                else {
                    var payments = Object.values(obj.payment);
                    payments.sort(function (a, b) {
                        return b.quantity - a.quantity;
                    });
                    billing.formaPago = payments[0].idPay;
                }
//FACTURA CFDI A CLIENTE EN ESPESIFICO
                billing.receptor.nombre = obj.client.person.socialR;
                billing.receptor.rfc = obj.client.person.rfc;
                billing.receptor.usoCFDI = "@UsoCFDI";
                billing.publicoGral = false;
                for (i = 0; i < objSale.products.length; i++) {
                    let item;
                    //if (typeof objSale.products[i].product.tax.iva == 'undefined' 
                    //objSale.products[i].product.tax.iva===undefined
                    if (!objSale.products[i].product.tax || !objSale.products[i].product.tax.iva || objSale.products[i].product.tax.iva != 16) {
                        item = "<cfdi:Concepto Cantidad=\"" + objSale.products[i].quantity + "\" "
                            + "ClaveProdServ=\"" + objSale.products[i].product.billing33 + "\" "
                            + "ClaveUnidad=\"" + 
                            ((!objSale.products[i].product.productUnit || !objSale.products[i].product.productUnit.billing33)?
                            "E48":objSale.products[i].product.productUnit.billing33 )
                             + "\" "
                            + "Descripcion=\"" + objSale.products[i].product.description + "\" "
                            + "Importe=\"" + parseFloat(objSale.products[i].amount).toFixed(2) + "\" "
                            + "NoIdentificacion=\"" +
                            (
                                (!objSale.products[i].product.code)?"01010101":objSale.products[i].product.code                            
                            )
                            + "\" "
                            + "Unidad=\"" + objSale.products[i].product.productUnit.name + "\" "
                            + "ValorUnitario=\"" + parseFloat(objSale.products[i].product.basePrice).toFixed(2) + "\" >"
                            + "</cfdi:Concepto>"
                    }
                    else {
                        item = "<cfdi:Concepto Cantidad=\"" + objSale.products[i].quantity + "\" "
                            + "ClaveProdServ=\"" + objSale.products[i].product.billing33 + "\" "
                            + "ClaveUnidad=\"" +                             
                            ((!objSale.products[i].product.productUnit || !objSale.products[i].product.productUnit.billing33)?
                            "E48":objSale.products[i].product.productUnit.billing33 )+"\" "
                            + "Descripcion=\"" + objSale.products[i].product.description + "\" "
                            + "Importe=\"" + parseFloat(objSale.products[i].amount).toFixed(2) + "\" "
                            + "NoIdentificacion=\"" + 
                            
                            (
                                (!objSale.products[i].product.code)?"01010101":objSale.products[i].product.code                            
                            )
                            
                            + "\" "
                            + "Unidad=\"" + 

                            ((!objSale.products[i].product.productUnit || !objSale.products[i].product.productUnit.name)?
                            "Unidad de Servicio":objSale.products[i].product.productUnit.name )
                            
                            
                            + "\" "
                            + "ValorUnitario=\"" + parseFloat(objSale.products[i].product.basePrice).toFixed(2) + "\" >"
                            + "<cfdi:Impuestos>"
                            + "<cfdi:Traslados>"
                            + "<cfdi:Traslado Base=\"" + parseFloat(objSale.products[i].amount).toFixed(2) + "\" "
                            + "Importe=\"" + parseFloat(objSale.products[i].transferred).toFixed(2) + "\" "
                            + "Impuesto=\"002\" TasaOCuota=\"0.1600\" TipoFactor=\"Tasa\" />"
                            + "</cfdi:Traslados>"
                            + "</cfdi:Impuestos>"
                            + "</cfdi:Concepto>";
                    }
                    concepts += item;
                }
            }

            billing.subTotal = parseFloat(obj.subTotal).toFixed(2);
            billing.total = parseFloat(obj.total).toFixed(2);
            billing.impuestoTraslados = parseFloat(obj.transferredTotal).toFixed(2);
            billing.impuestoRetenidos = parseFloat(obj.withheldTotal).toFixed(2);
            billing.totalIva=parseFloat(obj.totalIva).toFixed(2);
            billing.business = obj.business._id;

            billing.vXML =
                "<?xml version=\"1.0\" encoding=\"utf-8\"?> "
                + "<cfdi:Comprobante xsi:schemaLocation=\"http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd\" "
                + "Certificado=\"\" Fecha=\"@Fecha\" "
                + "Folio=\"@Folio\" FormaPago=\"" + billing.formaPago + "\" "
                + "LugarExpedicion=\"" + billing.lugarExpedicion + "\" "
                + "MetodoPago=\"PUE\" Moneda=\"MXN\" "
                + "NoCertificado=\"@NoCertificado\" "
                + "Sello=\"@Sello\" Serie=\"@Serie\" SubTotal=\"" + parseFloat(billing.subTotal).toFixed(2) + "\" "
                + "TipoDeComprobante=\"I\" Total=\"" + parseFloat(billing.total).toFixed(2) + "\"  Version=\"3.3\" "
                + "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
                + "xmlns:cfdi=\"http://www.sat.gob.mx/cfd/3\"> "
                + "<cfdi:Emisor Nombre=\"" + billing.emisor.nombre + "\" RegimenFiscal=\"" + billing.emisor.regimenFiscal + "\" Rfc=\"" + billing.emisor.rfc + "\"/> "
                + "<cfdi:Receptor Nombre=\"" + billing.receptor.nombre + "\" Rfc=\"" + billing.receptor.rfc + "\" UsoCFDI=\"" + billing.receptor.usoCFDI + "\" /> "
                + "<cfdi:Conceptos> "
                + concepts
                + "</cfdi:Conceptos> "
                +
                (!parseFloat(billing.impuestoTraslados) ? "<cfdi:Impuestos TotalImpuestosRetenidos=\"0\" "
                    + "TotalImpuestosTrasladados=\"" + parseFloat(billing.impuestoTraslados).toFixed(2) + "\"/> " :

                    "<cfdi:Impuestos TotalImpuestosRetenidos=\"0\" "
                    + "TotalImpuestosTrasladados=\"" + parseFloat(billing.impuestoTraslados).toFixed(2) + "\"> "
                    + "<cfdi:Traslados> "
                    + "<cfdi:Traslado Importe=\"" + parseFloat(billing.impuestoTraslados).toFixed(2) + "\" Impuesto=\"002\" TasaOCuota=\"0.1600\" TipoFactor=\"Tasa\"/> "
                    + "</cfdi:Traslados> "
                    + "</cfdi:Impuestos> ")

                + "</cfdi:Comprobante>";
            return res.json({ "Billing": billing });
        });

};

//FUNCION PARA FACTURACIÓN MULTIPLE A PUBLICO EN GENERAL-ALV EL INGLES!!
const getPublicBillingById = (req, res) => {
    const { _business } = req.params;
    let obj = req.body;
    _sale.find({ "_id": { $in: obj.sales } }).populate(
        {
            path: "business", model: "Business", select: "emisor address"
        }).exec(
        function (err, ventas) {
            if (err)
                handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
            if (!ventas) {
                return res.status(status.NOT_FOUND).json({
                    status: status.NOT_FOUND,
                    message: "Datos no encontrados"
                });
            }
            let amountTotal = 0, transferredTotalPUBLIC = 0, subTotalPUBLIC = 0, total = 0;
            var totalProductsIva=0;
            ventas.forEach(function (element) {                
                amountTotal += element.amountTotal;
                transferredTotalPUBLIC += element.transferredTotalPUBLIC;
                subTotalPUBLIC += element.subTotalPUBLIC;
                total += element.total;
                totalProductsIva+=element.totalProductsIva;            
            });

            var billing = new Object();
            billing.serie = "";
            billing.folio = "";
            billing.lugarExpedicion = ventas[0].business.address.cp;
            billing.formaPago = "";
            billing.metodoPago = "PUE";
            billing.tipoComprobante = "I";
            billing.moneda = "MXN";
            billing.sale = obj.sales;
            billing.fechaEmision = new Date();

            billing.emisor = new Object();
            billing.emisor.nombre = ventas[0].business.emisor.rs;
            billing.emisor.regimenFiscal = ventas[0].business.emisor.taxRegimen;;
            //typeof obj.business.emisor.taxRegimen !== 'undefined' ? obj.business.emisor.taxRegimen : '';
            billing.emisor.rfc = ventas[0].business.emisor.rfc;
            billing.receptor = new Object();
            var concepts = "";

            billing.receptor.nombre = "PÚBLICO GENERAL";
            billing.receptor.rfc = "XAXX010101000";
            billing.receptor.usoCFDI = "P01";
            billing.publicoGral = true;
            concepts =
                "<cfdi:Concepto Cantidad=\"1\" "
                + "ClaveProdServ=\"01010101\" "
                + "ClaveUnidad=\"ACT\" "
                + "Descripcion=\"Venta\" "
                + "Importe=\"" + parseFloat(amountTotal).toFixed(2) + "\" "
                + "NoIdentificacion=\"01010101\" "
                + "Unidad=\"ACT\" "
                + "ValorUnitario=\"" + parseFloat(amountTotal).toFixed(2) + "\" >"
                + (transferredTotalPUBLIC != 0 ?
                    "<cfdi:Impuestos>"
                    + "<cfdi:Traslados>"
                    + "<cfdi:Traslado Base=\"" + parseFloat(totalProductsIva).toFixed(2) + "\" "
                    + "Importe=\"" + parseFloat(transferredTotalPUBLIC).toFixed(2) + "\" "
                    + "Impuesto=\"002\" TasaOCuota=\"0.1600\" TipoFactor=\"Tasa\" />"
                    + "</cfdi:Traslados>"
                    + "</cfdi:Impuestos>" : "")
                + "</cfdi:Concepto>";
            billing.subTotalPUBLIC = subTotalPUBLIC;
            billing.total = total;
            billing.impuestoTraslados = transferredTotalPUBLIC;
            billing.impuestoRetenidos = 0;
            billing.business = _business;

            billing.vXML =
                "<?xml version=\"1.0\" encoding=\"utf-8\"?> "
                + "<cfdi:Comprobante xsi:schemaLocation=\"http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd\" "
                + "Certificado=\"\" Fecha=\"@Fecha\" "
                + "Folio=\"@Folio\" FormaPago=\"@FormaPago\" "
                + "LugarExpedicion=\"" + billing.lugarExpedicion + "\" "
                + "MetodoPago=\"PUE\" Moneda=\"MXN\" "
                + "NoCertificado=\"@NoCertificado\" "
                + "Sello=\"@Sello\" Serie=\"@Serie\" SubTotal=\"" + parseFloat(billing.subTotalPUBLIC).toFixed(2) + "\" "
                + "TipoDeComprobante=\"I\" Total=\"" + parseFloat(billing.total).toFixed(2) + "\"  Version=\"3.3\" "
                + "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
                + "xmlns:cfdi=\"http://www.sat.gob.mx/cfd/3\"> "
                + "<cfdi:Emisor Nombre=\"" + billing.emisor.nombre + "\" RegimenFiscal=\"" + billing.emisor.regimenFiscal + "\" Rfc=\"" + billing.emisor.rfc + "\"/> "
                + "<cfdi:Receptor Nombre=\"" + billing.receptor.nombre + "\" Rfc=\"" + billing.receptor.rfc + "\" UsoCFDI=\"P01\" /> "
                + "<cfdi:Conceptos> "
                + concepts
                + "</cfdi:Conceptos> " +
                (billing.impuestoTraslados == 0 ? "<cfdi:Impuestos TotalImpuestosRetenidos=\"0\" "
                    + "TotalImpuestosTrasladados=\"" + parseFloat(billing.impuestoTraslados).toFixed(2) + "\"/> " :
                    "<cfdi:Impuestos TotalImpuestosRetenidos=\"0\" "
                    + "TotalImpuestosTrasladados=\"" + parseFloat(billing.impuestoTraslados).toFixed(2) + "\"> "
                    + "<cfdi:Traslados> "
                    + "<cfdi:Traslado Importe=\"" + parseFloat(billing.impuestoTraslados).toFixed(2) + "\" Impuesto=\"002\" TasaOCuota=\"0.1600\" TipoFactor=\"Tasa\"/> "
                    + "</cfdi:Traslados> "
                    + "</cfdi:Impuestos> ")
                + "</cfdi:Comprobante>";
            return res.json({ "Billing": billing });
        }

        );

}
// const getPublicBillingById = (req, res) => {

//     const { _id } = req.params;
//     let query = {
//         _id: _id
//     }
//     _sale.findOne(query)
//         .populate({
//             path: "business", model: "Business", select: "address.cp emisor"
//         })
//         .populate({
//             path: "products.product.productUnit", model: "ProductUnit",
//             select: "name billing33"
//         })
//         .populate({
//             path: "client", model: "Client", select: 'person.rfc person.socialR person.personType'
//         })
//         .exec(function (err, obj) {

//             if (err) res.handleError(res, status.INTERNAL_SERVER_ERROR, err);

//             var billing = new Object();
//             billing.serie = "";
//             billing.folio = "";
//             billing.lugarExpedicion = obj.business.address.cp;
//             billing.formaPago = "";
//             billing.metodoPago = "PUE";
//             billing.tipoComprobante = "I";
//             billing.moneda = "MXN";
//             billing.sale = obj._id;
//             billing.fechaEmision = new Date();

//             billing.emisor = new Object();
//             billing.emisor.nombre = obj.business.emisor.rs;
//             billing.emisor.regimenFiscal = typeof obj.business.emisor.taxRegimen !== 'undefined' ? obj.business.receptor.taxRegimen : '';
//             billing.emisor.rfc = obj.business.emisor.rfc;

//             billing.receptor = new Object();
//             billing.receptor.nombre = "PÚBLICO GENERAL";
//             billing.receptor.rfc = "XAXX010101000";
//             billing.receptor.usoCFDI = "P01"

//             billing.subTotal = obj.subTotal;
//             billing.total = obj.total;
//             billing.impuestoTraslados = obj.transferredTotal;
//             billing.impuestoRetenidos = obj.withheldTotal;
//             billing.business = obj.business._id;
//             billing.publicoGral = true;
//             var objSale = JSON.parse(JSON.stringify(obj));

//             var concepts = "";

//             let item = "<cfdi:Concepto Cantidad='1' "
//                 + "ClaveProdServ='01010101' "
//                 + "ClaveUnidad='ACT' "
//                 + "Descripcion='Venta"
//                 + "Importe='" + parseFloat(objSale.amountTotal).toFixed(2) + "' "
//                 + "NoIdentificacion='01010101' "
//                 + "Unidad='ACT' "
//                 + "ValorUnitario='" + parseFloat(objSale.amountTotal).toFixed(2); +"' >"
//                     + "<cfdi:Impuestos>"
//                     + "<cfdi:Traslados>"
//                     + "<cfdi:Traslado Base='" + parseFloat(objSale.amountTotal).toFixed(2) + "' "
//                     + "Importe='" + parseFloat(objSale.transferredTotal).toFixed(2) + "' "
//                     + "Impuesto='002' TasaOCuota='0.1600' TipoFactor='Tasa' />"
//                     + "</cfdi:Traslados>"
//                     + "</cfdi:Impuestos>"
//                     + "</cfdi:Concepto>";

//             billing.vXML =
//                 "<?xml version='1.0' encoding='utf-8'?> "
//                 + "<cfdi:Comprobante xsi:schemaLocation='http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd' "
//                 + "Certificado='' Fecha='@Fecha' "
//                 + "Folio='@Folio' FormaPago='@FormaPago' "
//                 + "LugarExpedicion='" + billing.lugarExpedicion + "' "
//                 + "MetodoPago='PUE' Moneda='MXN' "
//                 + "NoCertificado='@NoCertificado' "
//                 + "Sello='@Sello' Serie='@Serie' SubTotal='" + parseFloat(billing.subTotal).toFixed(2) + "' "
//                 + "TipoDeComprobante='I' Total='" + parseFloat(billing.total) + "'  Version='3.3' "
//                 + "xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' "
//                 + "xmlns:cfdi='http://www.sat.gob.mx/cfd/3'> "
//                 + "<cfdi:Emisor Nombre='" + billing.emisor.nombre + "' RegimenFiscal='" + billing.emisor.regimenFiscal + "' Rfc='" + billing.emisor.rfc + "'/> "
//                 + "<cfdi:Receptor Nombre='" + billing.receptor.nombre + "' Rfc='" + billing.receptor.rfc + "' UsoCFDI='" + billing.receptor.usoCFDI + "' /> "
//                 + "<cfdi:Conceptos> "
//                 + concepts
//                 + "</cfdi:Conceptos> "
//                 + "<cfdi:Impuestos TotalImpuestosRetenidos='0' "
//                 + "TotalImpuestosTrasladados='" + parseFloat(billing.impuestoTraslados).toFixed(2) + "'> "
//                 + "<cfdi:Traslados> "
//                 + "<cfdi:Traslado Importe='" + parseFloat(billing.impuestoTraslados).toFixed(2) + "' Impuesto='002' TasaOCuota='0.1600' TipoFactor='Tasa'/> "
//                 + "</cfdi:Traslados> "
//                 + "</cfdi:Impuestos> "
//                 + "</cfdi:Comprobante>";

//             return res.json({ "Billing": billing });
//         });

// };
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const create = (req, res) => {
    let _obj = req.body;
    _obj.business = req.params._id;

    _sale.create(_obj, (err, _created) => {
        if (err)
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

        res.json({ sale: _created });
    });

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const update = (req, res) => {
    const { _id } = req.params;
    const _obj = req.body;

    const query = { _id: _id };

    _sale.findOneAndUpdate(query, _obj, { new: true })
        .exec(handler.handleOne.bind(null, 'sale', res));
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const remove = (req, res) => {
    const { _id } = req.params;

    let query = { _id: _id };

    _sale.findOneAndUpdate(query, { dropped: new Date() }, { new: true })
        .exec(handler.handleOne.bind(null, 'sale', res));
}

/**
 * 
 */
module.exports = (Sale) => {
    _sale = Sale;
    return ({
        getByBusiness,
       
        getByDate,
        getBillingById,
        getPublicBillingById,
        getById,
        create,
        update,
        remove
    });
};