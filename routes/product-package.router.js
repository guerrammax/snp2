const router = require('express').Router();

module.exports = (wagner) => {

    const productPackageController = wagner.invoke((ProductPackage) =>
        require('../controllers/product-package.controller')(ProductPackage));

    /**
     * 
     */
    router.get('/business/:_id', (req, res) =>
        productPackageController.getByBusiness(req, res));

    /**
     * 
     */
    router.get('/:_id', (req, res) =>
        productPackageController.getById(req, res));

    /**
     * 
     */
    router.post('/business/:_id', (req, res) =>
        productPackageController.create(req, res));

    /**
     * 
     */
    router.put('/:_id', (req, res) =>
        productPackageController.update(req, res));

    /**
     * 
     */
    router.delete('/:_id', (req, res) =>
        productPackageController.remove(req, res));

    return router;
}