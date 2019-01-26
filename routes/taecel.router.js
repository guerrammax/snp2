const router = require('express').Router();

module.exports = (wagner) => {

    const taecelController = wagner.invoke((Business, Sale, Configuration, User, TaecelSale) =>
        require('../controllers/taecel.controller')(Business, Sale, Configuration, User, TaecelSale));

    
    
    const taecelVirtualController = wagner.invoke((VirtualBags, VirtualBagsLog) =>
        require('../controllers/taelcel-virtual.controller')(VirtualBags,VirtualBagsLog));
                
    /**
     * 
     */
    router.get('/getBalance', (req, res) =>
        taecelController.getBalance(req, res));

    /**
     * 
     */
    router.post('/requestTXN', (req, res) =>
        taecelController.requestTXN(req, res));

    /**
     * 
     */
    router.get('/statusTXN/:transID', (req, res) =>
        taecelController.statusTXN(req, res));

    /**
     * 
     */
    router.get('/getProducts', (req, res) =>
        taecelController.getProducts(req, res));

    /**
     * 
     */
    router.get('/getSales/:date', (req, res) =>
        taecelController.getSales(req, res));
        
    router.put('/entry/:_id',(req,res)=>
        taecelVirtualController.entryVirtual(req,res));

    router.get('/getBalanceVirtual/:_id',(req,res)=>
        taecelVirtualController.getTaelcel(req,res));

    return router;
}


