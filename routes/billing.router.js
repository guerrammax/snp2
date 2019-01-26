const router = require('express').Router();

module.exports = (wagner) => {

  const billing33Controller = wagner.invoke((Billing33Product,Billing33Unit) =>
    require('../controllers/billing33.controller')(Billing33Product,Billing33Unit));

    /**
     * 
     */
    router.get('/billing33/products/:search', (req, res) => 
        billing33Controller.searchBilling33Product(req, res));
    
    /**
     * 
     */
    router.get('/billing33/units/:search', (req, res) => 
        billing33Controller.searchBilling33Unit(req, res));

    /**
     * 
     */
    router.get('/billing33/productscode/:search', (req, res) => 
        billing33Controller.searchBilling33ProductCode(req, res));
    
    /**
     * 
     */
    router.get('/billing33/unitscode/:search', (req, res) => 
        billing33Controller.searchBilling33UnitCode(req, res));
    return router;
}