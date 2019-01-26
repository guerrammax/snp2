const router = require('express').Router();

module.exports = (wagner) => {

    const imageController = require('../controllers/image.controller');

    /**
     * 
     */
    router.get('/:_id', (req, res) =>
        imageController.create(req, res));

    /**
     * 
     */
    router.post('/', (req, res) =>
        imageController.saveImage(req, res));

    return router;
}