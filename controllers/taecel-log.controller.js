const handler = require('../utils/handler');

let _taecelLog;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getByBusiness = (req, res) => {
    let { _id } = req.params;
    let query = {
        business: _id
    }
    _taecelLog.find(query)
        .exec(handler.handleMany.bind(null, 'taecelLogs', res));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getAll = (req, res) => {
    // const { _id } = req.params;

    let query = {
        // _id: _id
    }

    _taecelLog.find(query)
        .populate('user')
        .populate('business')
        .exec(handler.handleOne.bind(null, 'taecelLogs', res));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const create = (req, res) => {
    let _obj = req.body;

    _taecelLog.create(_obj, (err, _created) => {
        if (err)
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

        res.json({ taecelLog: _created });
    });

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
// const update = (req, res) => {
//     const { _id } = req.params;
//     const _obj = req.body;

//     const query = { _id: _id };

//     _taecelLog.findOneAndUpdate(query, _obj, { new: true })
//         .exec(handler.handleOne.bind(null, 'productPackage', res));
// }

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
// const remove = (req, res) => {
//     const { _id } = req.params;

//     let query = { _id: _id };

//     _taecelLog.findOneAndUpdate(query, { dropped: new Date() }, { new: true })
//         .exec(handler.handleOne.bind(null, 'productPackage', res));
// }

/**
 * 
 */
module.exports = (TaecelLog) => {
    _taecelLog = TaecelLog;
    return ({
        getByBusiness,
        getAll,
        create,
        // update,
        // remove
    });
};