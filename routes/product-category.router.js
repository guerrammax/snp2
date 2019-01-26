const router = require('express').Router();

module.exports = (wagner) => {

    const productCategoryController = wagner.invoke((ProductCategory) =>
        require('../controllers/product-category.controller')(ProductCategory));

    /**
     * 
     */
    router.get('/business/:_id', (req, res) =>
        productCategoryController.getByBusiness(req, res));

    /**
     * 
     */
    router.get('/:_id', (req, res) =>
        productCategoryController.getById(req, res));

    /**
     * 
     */
    router.post('/business/:_id', (req, res) =>
        productCategoryController.create(req, res));

    /**
     * 
     */
    router.put('/:_id', (req, res) =>
        productCategoryController.update(req, res));

    /**
     * 
     */
    router.delete('/:_id', (req, res) =>
        productCategoryController.remove(req, res));

    return router;
}