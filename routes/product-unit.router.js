const router = require('express').Router();

module.exports = (wagner) => {

    const productUnitController = wagner.invoke((ProductUnit) =>
        require('../controllers/product-unit.controller')(ProductUnit));

    /**
     * 
     */
    router.get('/business/:_id', (req, res) =>
        productUnitController.getByBusiness(req, res));

    /**
     * 
     */
    router.get('/:_id', (req, res) =>
        productUnitController.getById(req, res));

    /**
     * 
     */
    router.post('/business/:_id', (req, res) =>
        productUnitController.create(req, res));

    /**
     * 
     */
    router.put('/:_id', (req, res) =>
        productUnitController.update(req, res));

    /**
     * 
     */
    router.delete('/:_id', (req, res) =>
        productUnitController.remove(req, res));

    return router;
}