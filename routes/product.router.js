const router = require('express').Router();

module.exports = (wagner) => {

    const productController = wagner.invoke((Product) =>
        require('../controllers/product.controller')(Product));

    /**
    * 
    */
    router.get('/business/:_id/search', (req, res) =>
        productController.getByNameSearch(req, res));
    

    /**
     * 
     */    

    router.get('/business/:_id', (req, res) =>
        productController.getByBusiness(req, res));

    /**
     * 
     */
    router.get('/productType/:productType', (req, res) =>
        productController.getByProductType(req, res));

    /**
     * 
     */
    router.get('/:_id', (req, res) =>
        productController.getById(req, res));

    /**
     * 
     */
    router.post('/business/:_id', (req, res) =>
        productController.create(req, res));

    /**
     * 
     */
    router.put('/:_id', (req, res) =>
        productController.update(req, res));

    /**
     * 
     */
    router.delete('/:_id', (req, res) =>
        productController.remove(req, res));

    return router;
}