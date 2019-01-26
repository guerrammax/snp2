const router = require('express').Router();

module.exports = (wagner) => {

    const productBrandController = wagner.invoke((ProductBrand) =>
        require('../controllers/product-brand.controller')(ProductBrand));

    /**
     * 
     */
    router.get('/business/:_id', (req, res) =>
        productBrandController.getByBusiness(req, res));

    /**
     * 
     */
    router.get('/:_id', (req, res) =>
        productBrandController.getById(req, res));

    /**
     * 
     */
    router.post('/business/:_id', (req, res) =>
        productBrandController.create(req, res));

    /**
     * 
     */
    router.put('/:_id', (req, res) =>
        productBrandController.update(req, res));

    /**
     * 
     */
    router.delete('/:_id', (req, res) =>
        productBrandController.remove(req, res));

    return router;
}