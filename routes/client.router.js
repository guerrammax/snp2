const router = require('express').Router();

module.exports = (wagner) => {
    const clientController = wagner.invoke((Client) =>
        require('../controllers/client.controller')(Client));
    /**
     * 
     */
    router.get('/business/:_id/search', (req, res) =>
        clientController.getByNameSearch(req, res));

    /**
     * 
     */
    router.get('/business/:_id', (req, res) =>
        clientController.getByBusiness(req, res));

    /**
     * 
     */
    router.get('/:_id', (req, res) =>
        clientController.getById(req, res));

    /**
     * 
     */
    router.post('/business/:_id', (req, res) =>
        clientController.create(req, res));

    /**
     * 
     */
    router.put('/:_id', (req, res) =>
        clientController.update(req, res));

    /**
     * 
     */
    router.delete('/:_id', (req, res) =>
        clientController.remove(req, res));

    return router;
}