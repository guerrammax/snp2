const router = require('express').Router();

module.exports = (wagner) => {

    const productTypeController = wagner.invoke((ProductType) =>
        require('../controllers/product-type.controller')(ProductType));

    /**
     * 
     */
    router.get('/business/:_id', (req, res) =>
        productTypeController.getByBusiness(req, res));

    /**
     * 
     */
    router.get('/:_id', (req, res) =>
        productTypeController.getById(req, res));

    /**
     * 
     */
    router.post('/business/:_id', (req, res) =>
        productTypeController.create(req, res));

    /**
     * 
     */
    router.put('/:_id', (req, res) =>
        productTypeController.update(req, res));

    /**
     * 
     */
    router.delete('/:_id', (req, res) =>
        productTypeController.remove(req, res));
    
    return router;
}