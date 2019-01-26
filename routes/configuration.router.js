const router = require('express').Router();

module.exports = (wagner) => {

  const configurationController = wagner.invoke((Configuration) =>
    require('../controllers/configuration.controller')(Configuration));

    /**
     * 
     */
    router.get('/', (req, res) => 
        configurationController.getEmail(req, res));
    
    /**
     * 
     */
    router.post('/', (req, res) => 
        configurationController.setEmail(req, res));

    // router.get('/:_id', (req, res) =>
    //     configurationController.getOne(req, res));
    
    // router.post('/', (req, res) =>
    //     configurationController.insert(req, res));
    
    // router.put('/:_id', (req, res) => 
    //     configurationController.update(req, res));
    
    // router.delete('/:_id', (req, res) => 
    //     configurationController.delete(req, res));

    return router;
}