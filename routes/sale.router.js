const router = require('express').Router();

module.exports = (wagner) => {

    const saleController = wagner.invoke((Sale) =>
        require('../controllers/sale.controller')(Sale));

    /**
     * 
     */    
    router.get('/business/:_id', (req, res) =>
    {        
        saleController.getByBusiness(req, res)
    });
    
    /**
    * 
    */
    router.get('/business/:_id/search', (req, res) =>
        saleController.getByDate(req, res));

    /**
     * 
     */
    router.get('/billing/:_id',(req,res)=>
    saleController.getBillingById(req,res))


    router.post('/billing',(req,res)=>
    saleController.getPublicBillingById(req,res))
    
    router.get('/:_id', (req, res) =>
        saleController.getById(req, res));

    /**
     * 
     */
    router.post('/business/:_id', (req, res) =>
        saleController.create(req, res));

    /**
     * 
     */
    router.put('/:_id', (req, res) =>
        saleController.update(req, res));

    /**
     * 
     */
    router.delete('/:_id', (req, res) =>
        saleController.remove(req, res));

    return router;
}