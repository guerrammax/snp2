const router = require('express').Router();

module.exports = (wagner) => {

    const userController = wagner.invoke((User, Business, BusinessTemporal, BranchOffice, Configuration) =>
        require('../controllers/user.controller')(User, Business, BusinessTemporal, BranchOffice, Configuration));

    /**
     * 
     */
    router.post('/login', (req, res) =>
        userController.login(req, res));

    /**
     * 
     */
    router.post('/signup', (req, res) =>
        userController.signup(req, res));

    /**
     * 
     */
    router.get('/verifyEmail', (req, res) =>
        userController.verifyEmail(req, res));

    /**
     * 
     */
    router.get('/verifyPhone', (req, res) =>
        userController.verifyPhone(req, res));

    /**
     * 
     */
    router.post('/changepassword', (req, res) =>
        userController.changePassword(req, res));

    /**
     * 
     */
    router.get('/business/:_id', (req, res) =>
        userController.getByBusiness(req, res));

    /**
     * 
     */
    router.get('/:_id', (req, res) =>
        userController.getById(req, res));

    /**
     * 
     */
    router.post('/register/:_id', (req, res) =>
        userController.register(req, res));

    /**
     * 
     */
    router.put('/:_id', (req, res) =>
        userController.udpate(req, res));

    /**
     * 
     */
    router.delete('/:_id', (req, res) =>
        userController.delete(req, res));

    return router;
}