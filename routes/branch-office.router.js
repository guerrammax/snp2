const router = require('express').Router();

module.exports = (wagner) => {

  const branchOfficeController = wagner.invoke((BranchOffice) =>
    require('../controllers/branch-office.controller')(BranchOffice));

    /**
     * 
     */
    router.get('/business/:_id', (req, res) => 
        branchOfficeController.getByBusiness(req, res));
    
    /**
     * 
     */
    router.get('/:_id', (req, res) =>
        branchOfficeController.getById(req, res));
    
    /**
     * 
     */
    router.post('/business/:_id', (req, res) =>
        branchOfficeController.create(req, res));
    
    /**
     * 
     */
    router.put('/:_id', (req, res) => 
        branchOfficeController.update(req, res));
    
    /**
     * 
     */
    router.delete('/:_id', (req, res) => 
        branchOfficeController.remove(req, res));

    return router;
}