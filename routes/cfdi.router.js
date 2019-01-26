const router = require('express').Router();

module.exports=(wagner)=>{          
    const cfdiController=wagner.invoke((CFDIs)=>
        require('../controllers/cfdi.controller')(CFDIs));

 router.get('/business/:_id', (req, res) =>
        cfdiController.getAll(req, res));

// router.get('/business/:_id/public', (req, res) =>
//         cfdiController.getPublic(req, res));

// router.get('/business/:_id/customer', (req, res) =>
//         cfdiController.getCustomer(req, res));

 router.get('/business/:_id/canceled', (req, res) =>
        cfdiController.getAllCanceled(req, res));

// router.get('/business/:_id/canceledpublic', (req, res) =>
//         cfdiController.getCanceledPublic(req, res));

// router.get('/business/:_id/canceledcustomer', (req, res) =>
//         cfdiController.getCanceledCustomer(req, res));

 router.get('/:_id', (req, res) =>
        cfdiController.getById(req, res));

router.post('/business/:_id', (req, res) =>
        cfdiController.create(req, res));

router.post('/stamp', (req, res) =>
        cfdiController.setStamp(req, res));

router.put('/:_id', (req, res) =>
        cfdiController.update(req, res));

router.delete('/:_id', (req, res) =>
        cfdiController.remove(req, res));
        return router;
}