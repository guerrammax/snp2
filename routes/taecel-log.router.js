const router = require('express').Router();

module.exports = (wagner) => {

    const taecelLogController = wagner.invoke((TaecelLog) =>
        require('../controllers/taecel-log.controller')(TaecelLog));

    const taecelVirtualLogController = wagner.invoke((VirtualBagsLog) =>
        require('../controllers/taelcel-virtual-log.controller')(VirtualBagsLog));
    /**
     * 
     */
    router.get('/:_id', (req, res) =>
        taecelLogController.getByBusiness(req, res));

    /**
    * 
    */
    router.get('/', (req, res) =>
        taecelLogController.getAll(req, res));

    /**
     * 
     */
    router.post('/', (req, res) =>
        taecelLogController.create(req, res));

    // router.get("/virtual/:_id",(req,res)=>{
    //     taecelVirtualLogController.getById(req,res);
    // });
    
    
    router.get("/virtual/:_id",(req,res)=>{
        taecelVirtualLogController.getVirtualLog(req,res);
    })
    /**
     * 
     */
    // router.put('/:_id', (req, res) =>
    //     taecelLogController.update(req, res));

    /**
     * 
     */
    // router.delete('/:_id', (req, res) =>
    //     taecelLogController.remove(req, res));

    return router;
}