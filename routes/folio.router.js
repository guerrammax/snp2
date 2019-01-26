const router = require('express').Router();

module.exports = (wagner) => {
    
    const internalFolios = wagner.invoke((Folios) =>
        require('../controllers/folio.controller')(Folios));                
            
        router.get('/business/:_id',(req,res)=>
            internalFolios.getAll(req,res));

        router.get('/business/:_id/default',(req,res)=>
            internalFolios.getDefault(req,res));

        router.get('/business/:_id/billing',(req,res)=>
            internalFolios.getBilling(req,res));        
        
        router.post('/business/:_id', (req, res) =>
        internalFolios.create(req, res));

        router.put('/:_id', (req, res) =>
        internalFolios.update(req, res));

        router.put('/business/:_id/default', (req, res) =>
        internalFolios.updateDefault(req, res));

        router.delete('/:_id', (req, res) =>
        internalFolios.remove(req, res));
        
        return router;
}