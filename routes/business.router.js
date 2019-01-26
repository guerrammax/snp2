const router = require('express').Router();

module.exports = (wagner) => {

    const businessController = wagner.invoke((Business, BusinessTemporal) =>
        require('../controllers/business.controller')(Business, BusinessTemporal));

    /**
     * 
     */
    router.get('/search', (req, res) =>
        businessController.getByNameSearch(req, res));

    /**
     * 
     */
    router.get('/:_id', (req, res) =>
        businessController.getById(req, res));

    /**
     * 
     */
    router.get('/', (req, res) =>
        businessController.getAll(req, res));

    /**
     * 
     */
    router.put('/business/:business/addTaecelStock', (req, res) =>
        businessController.addTaecelStock(req, res));

    /**
     * 
     */

    router.put('/business/:business/fiscal', (req, res) =>
        businessController.updateFiscal(req, res));
    
    /**
     * 
     */
    router.put('/business/:business/ticket/header', (req, res) =>
        businessController.updateTicketHeader(req, res));

    /**
     * 
     */
    router.put('/business/:business/ticket/footer', (req, res) =>
        businessController.updateTicketFooter(req, res));

    /**
     * 
     */
       

    router.put('/business/:business/configuration', (req, res) =>
        businessController.updateConfiguration(req, res));    


    router.put('/business/:business/address', (req, res) =>
        businessController.updateAddress(req, res));    
    /**
     * 
     */
    router.get('/business/:business/getTaecelStock', (req, res) =>
        businessController.getTaecelStock(req, res));

    /**
     * 
     */
    // router.post('/business/:_id', (req, res) =>
    //     businessController.create(req, res));

    /**
     * 
     */
    router.put('/:_id', (req, res) =>
        businessController.update(req, res));

    /**
     * 
     */
    router.delete('/:_id', (req, res) =>
        businessController.remove(req, res));

    /**
     * 
     */
    router.put('/business/:business/emailConfiguration', (req, res) =>
        businessController.emailConfiguration(req, res));

    /**
     * 
     */
    router.put('/business/:business/emailTest', (req, res) =>
        businessController.emailTest(req, res));

    /**
     * 
     */
    router.put('/business/:business/emailBusiness', (req, res) =>
        businessController.emailBusiness(req, res));

    /**
     * BUSINESS TEMPORAL
     */

    /**
     * 
     */
    router.get('/business/temporal', (req, res) =>
        businessController.getAllBusinessTemporal(req, res));

    router.post('/business/temporal/register/:business', (req, res) =>
        businessController.register(req, res));

    return router;
}

// emailConfiguration