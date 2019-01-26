const router = require('express').Router();

module.exports = (wagner) => {

//   const clientController = wagner.invoke((Client) =>
//     require('../controllers/client.controller')(Client));

    const postalCodeController = wagner.invoke((PostalCode) =>
        require('../controllers/postal-code.controller')(PostalCode));

    /**
     * 
     */
    router.get('/search', (req, res) => 
        postalCodeController.getPostalCode(req, res));

    return router;
}