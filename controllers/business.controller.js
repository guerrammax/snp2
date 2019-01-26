const handler = require('../utils/handler');
const status = require('http-status');
const Cryptr = require('cryptr');

let _business;
let _businessTemporal;
const _sale = require('../models/sale.model');

const _virtualTaelcel = require('../models/virtual-taelcel.model');
const _virtualLogTaelcel = require('../models/virtual-taelcel-log.model');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getAll = (req, res) => {
    _business.find()
        .exec(handler.handleMany.bind(null, 'businesses', res));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getByNameSearch = (req, res) => {
    const { name } = req.query;

    let query = {
        $text: { $search: name }
    }

    _business.find(query)
        .exec(handler.handleMany.bind(null, 'businesses', res));
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

    _business.findOne(query)
        .exec(handler.handleOne.bind(null, 'business', res));
};

const getTaecelStock = (req, res) => {
    const { business } = req.params;

    let query = {
        _id: business
    }

    _business.findOne(query, { "taecelStock.quantity": 1,"taecelService.quantity":1 })
        .exec(handler.handleOne.bind(null, 'taecelStock', res));
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const create = (req, res) => {
    let _obj = req.body;
    _obj.business = req.params._id;

    _business.create(_obj, (err, _created) => {
        if (err)
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

        res.json({ business: _created });
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

    _business.findOneAndUpdate(query, _obj, { new: true })
        .exec(handler.handleOne.bind(null, 'business', res));
}

const updateFiscal = (req, res) => {
    const {business} = req.params;
    const _obj = req.body;

    const query = {
        _id: business
    }
    _business.findOneAndUpdate(query, {
        $set: {
            "emisor.type": _obj.type,
            "emisor.rfc": _obj.rfc,
            "emisor.rs": _obj.rs,
            "emisor.taxRegimen": _obj.taxRegimen
        }
    },
        { new: true }).exec(handler.handleOne.bind(null, 'business', res));
}

const updateTicketHeader = (req, res) => {
    const {business} = req.params;
    const _obj = req.body;

    const query = {
        _id: business
    }
    _business.findOneAndUpdate(query, {
        $set: {
            "ticket.h1": _obj.h1,
            "ticket.h2": _obj.h2,
            "ticket.h3": _obj.h3,
            "ticket.h4": _obj.h4,
            "ticket.h5": _obj.h5
        }
    },
        { new: true }).exec(handler.handleOne.bind(null, 'business', res));
}


const updateTicketFooter = (req, res) => {
    const {business} = req.params;
    const _obj = req.body;

    const query = {
        _id: business
    }
    _business.findOneAndUpdate(query, {
        $set: {
             "ticket.f1": _obj.f1,
             "ticket.f2": _obj.f2,
             "ticket.f3": _obj.f3,
             "ticket.f4": _obj.f4,
             "ticket.f5": _obj.f5
        }
    },
        { new: true }).exec(handler.handleOne.bind(null, 'business', res));
}

             


const updateConfiguration = (req, res) => {
    const {business} = req.params;
    const _obj = req.body;

    const query = {
        _id: business
    }

    _business.findOneAndUpdate(query, {
        $set: {
            "billingDataProvider.user": _obj.user,
            "billingDataProvider.password": _obj.password,
            "billingDataProvider.serviceNumber": _obj.serviceNumber,
            "billingDataProvider.certificateNumber": _obj.certificateNumber
        }
    },
        { new: true }).exec(handler.handleOne.bind(null, 'business', res));

}

const updateAddress = (req, res) => {
    const {business} = req.params;
    const _obj = req.body;

    const query = {
        _id: business
    }

    _business.findOneAndUpdate(query, {
        $set: {
            "address.state.code": _obj.stateCode,
            "address.state.name": _obj.state,
            "address.city.code": _obj.cityCode,
            "address.city.name": _obj.city,
            "address.cp": _obj.cp,
            "address.neighborhood.name": _obj.neighborhood,
            "address.neighborhood.type": _obj.neighborhoodType,
            "address.address": _obj.address,
            "address.number": _obj.number,
            "address.number2": _obj.number2,
            "address.refere": _obj.reference
        }
    }, { new: true }).exec(handler.handleOne.bind(null, 'business', res));
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const remove = (req, res) => {
    const { _id } = req.params;

    let query = { _id: _id };

    _business.findOneAndUpdate(query, { dropped: new Date() }, { new: true })
        .exec(handler.handleOne.bind(null, 'business', res));
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const addTaecelStock = (req, res) => {
    _virtualTaelcel;
    _virtualLogTaelcel;
    const _obj = req.body;

    const _id = req.params.business;
    let query = {
        _id: _id
    }
    // const { quantity } = _obj;    
    // let _obj2 = {
    //     $inc: {
    //         "taecelStock.quantity": quantity
    //     }
    // };
    // _business.findOneAndUpdate(query, _obj2, { new: true })
    //     .exec(handler.handleOne.bind(null, 'business', res));

    let topUp = _obj.topUp;
    let service = _obj.service;
    let bag = _obj.bag;
    let _inc = {        
        $inc: {
            "taecelStock.quantity": topUp,
            "taecelService.quantity": service
        }
    };

    let queryBag={
        _id:bag
    };

    _virtualTaelcel.findOne(queryBag, function (err, virtualBefore) {
        if (err)
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
        if (!virtualBefore) {
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, { message: "Bolsa no encontrada" });
        }        
        _virtualTaelcel.findOneAndUpdate(queryBag, {
            $inc: {
                taelcelTopUp: (parseFloat(topUp) * -1),
                taelcelService: (parseFloat(service) * -1)
            }
        }, { new: true }, function (err, virtual) {
            
                if (err)
                    return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
                if (!virtual) {
                    return handler.handleError(res, status.INTERNAL_SERVER_ERROR, { message: "Bolsa no actualizada" });
                }
                
                _virtualLogTaelcel.create({
                    movement: "Egreso",
                    registerDate: new Date(),
                    user: _obj.user,
                    bag:_obj.bag,
                    reference: _obj.Reference,
                    beforeTaelcelTopUp: virtualBefore.taelcelTopUp,
                    currentTaelcelTopUp: virtual.taelcelTopUp,
                    beforeTaelcelService: virtualBefore.taelcelService,
                    currentTaelcelService: virtual.taelcelService,
                }, function (err, log) {
                    if (err)
                          return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
                    if (!log) {
                        return handler.handleError(res, status.INTERNAL_SERVER_ERROR, { message: "Log no creado" });
                    }                 
                    _business.findOneAndUpdate(query, _inc, { new: true }, function (err, business) {
                        if (err)
                        return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);
                        if (!business) {
                            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, { message: "El traspaso no fue realizado" });
                        }
                        res.json({ "Business":  business});
                    });
                });
            });
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const emailConfiguration = (req, res) => {
    const cryptr = new Cryptr(require('../config').secret);
    const { business } = req.params;
    const _id = business;
    const _obj = req.body;

    let { pass } = _obj.emailConfiguration.auth;

    if (pass) {
        pass = cryptr.encrypt(pass);

        _obj.emailConfiguration.auth.pass = pass;

        const query = { _id: _id };

        _business.findOneAndUpdate(query, _obj, { new: true })
            .exec(handler.handleOne.bind(null, 'business', res));
    }
    else
        return res.status(status.INTERNAL_SERVER_ERROR)
            .json({
                status: status.INTERNAL_SERVER_ERROR,
                message: "No fue posible realizar los cambios."
            });
}

const emailTest = (req, res) => {
    // _business.findOne()

    let cryptr = new Cryptr(require('../config').secret);
    const { business } = req.params;
    const _id = business;
    const _obj = req.body;

    let { pass } = _obj.auth;

    if (pass) {
        // pass = cryptr.decrypt(pass);
        _obj.auth.pass = pass;
        _mailerController.sendEmailBusinessTest(res, _obj);
    } else
        return res.status(status.INTERNAL_SERVER_ERROR)
            .json({
                status: status.INTERNAL_SERVER_ERROR,
                message: "No fue posible enviar el correo"
            });
}

const emailBusiness = (req, res) => {
    const cryptr = new Cryptr(require('../config').secret);
    const { business } = req.params;
    const _obj = req.body;

    let queryBusiness = {
        _id: business
    }

    _business.findOne(queryBusiness)
        .exec((err, _founded) => {
            let emailConfiguration = _founded.emailConfiguration;
            let { pass } = emailConfiguration.auth;
            if (pass) {
                pass = cryptr.decrypt(pass);
                emailConfiguration.auth.pass = pass;
                _mailerController.sendEmailBusiness(res, _obj, emailConfiguration);
            } else
                return res
                    .status(status.INTERNAL_SERVER_ERROR)
                    .json({
                        status: status.INTERNAL_SERVER_ERROR,
                        message: "No fue posible enviar el correo"
                    });
        });
}

/**
 * BUSINESS TEMPORAL
 */

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getAllBusinessTemporal = (req, res) => {
    _businessTemporal.find()
        .exec(handler.handleMany.bind(null, 'businessesTemporal', res));
};

// const register = (req, res) => {
//     const _json = req.body;
//     const { business } = req.params;

//     const { quantity } = _json;
//     const { license } = _json;

//     const query = {
//         _id: business
//     }

//     _businessTemporal.findOne(query)
//         .exec((err, _founded) => {
//             if (err)
//                 return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

//             if (!_founded)
//                 return res
//                     .status(status.INTERNAL_SERVER_ERROR)
//                     .json({
//                         status: status.INTERNAL_SERVER_ERROR,
//                         message: "Recurso no encontrado."
//                     });

//             let _obj = {
//                 person: _founded.person,
//                 name: _founded.name,
//                 address: _founded.address,
//                 taecelStock: {
//                     quantity: quantity ? quantity : 0
//                 },
//                 license: license ? license : new Date()
//             };

//             _business.create(_obj, (err, _founded2) => {
//                 if (err)
//                     return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

//                 let _obj2 = {
//                     business: _founded2._id,
//                     name: _founded2.name + " CENTRAL",
//                     person: _founded2.person
//                 }

//                 _branchOffice.create(_obj2, (err, _founded3) => {
//                     if (err)
//                         return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

//                     var password = ("pw" + _founded.name.replace(/ /g, "") + parseInt(Math.random() * 1000)).toLowerCase();
//                     let saltRounds = "S0lut10ns!".length;

//                     bcrypt.genSalt(saltRounds, (err, salt) => {
//                         bcrypt.hash(password, salt, (err, hash) => {

//                             let _obj3 = {
//                                 person: _founded.person,
//                                 user: ("u" + _founded.name.replace(/ /g, "")).toLowerCase(),
//                                 password: hash,
//           getByNameSearch                      email: _founded.person.email,
//                                 business: _founded2._id,
//                                 branchOffice: _founded3._id
//                             }

//                             _user.create(_obj3, (err, _founded4) => {
//                                 if (err)
//                                     return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

//                                 _founded4._password = password;
//                                 _businessTemporal.remove({ _id: _founded._id }, (err) => {
//                                     // name, email, user, password
//                                     let resJSON = {
//                                         business: _founded2,
//                                         branchOffice: _founded3,
//                                         user: _founded4
//                                     };

//           getByNameSearch                          _mailerController.sendEmailNewUser(res, resJSON, _founded4);
//                                 });
//                             });
//                         });
//                     });
//                 });
//             });
//         });
// };

/**
 * 
 */
module.exports = (Business, BusinessTemporal) => {
    const mailerController = require('../controllers/mailer.controller')(/*Business, Configuration, User*/);
    _mailerController = mailerController;

    _business = Business;
    _businessTemporal = BusinessTemporal;
  
    return ({
        getAll,
        getById,
        getByNameSearch,
        create,
        update,
        updateFiscal,
        updateConfiguration,
        updateAddress,
        remove,
        getTaecelStock,
        addTaecelStock,
        emailConfiguration,
        emailTest,
        getAllBusinessTemporal,
        updateTicketHeader,
        updateTicketFooter

    });
};