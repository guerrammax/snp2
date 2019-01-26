const router = require('express').Router();

module.exports = (wagner) => {

    const pdfController = wagner.invoke(() =>
        require('../controllers/pdf.controller')());

    /**
     * 
     */
    router.put('', (req, res) =>
        pdfController.sendPDF(req, res));

    return router;
}