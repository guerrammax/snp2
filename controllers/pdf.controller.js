const status = require('http-status');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const sendPDF = (req, res) => {

    let { _obj } = req.body;
    // console.log(req.body);
    _mailerController.sendEmailPDF(res, _obj)
    
    // let { _id } = req.params;
    // let query = {
    //     business: _id
    // }
    // _productType.find(query)
    //     .exec(handler.handleMany.bind(null, 'productTypes', res));
};

module.exports = () => {
    const mailerController = require('../controllers/mailer.controller')();
    _mailerController = mailerController;
    return ({
        sendPDF
    });
};