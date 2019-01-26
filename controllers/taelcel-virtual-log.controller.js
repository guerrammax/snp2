const handler = require('../utils/handler');
let _taecelVirtualLog;


const getVirtualLog = (req, res) => {
    let { _id } = req.params;
    let { from } = req.query;
    let { to } = req.query;

    let query;
    let _fromDate;
    let _toDate;

    if (!from && !to) {
        query = {
            bag: _id
        };
    }
    else {
        if (!to) {
            _fromDate = new Date(from);
            _toDate = new Date(from);
            _toDate.setDate(_fromDate.getDate() + 1);
        } else {
            _fromDate = new Date(from);
            _toDate = new Date(to);
            _toDate.setDate(_toDate.getDate() + 1)
        }
        query={
            bag: _id,
            registerDate: { $gte: _fromDate, $lt: _toDate },
        }
    }
    _taecelVirtualLog.find(query).exec(handler.handleMany.bind(null, 'taecelVirtualLogs', res));
}



const getById = (req, res) => {
    let { _id } = req.params;
    let query = {
        _id: _id
    };
    _taecelVirtualLog.findOne(query).exec(handler.handleOne.bind(null, 'taecelVirtualLog', res));
}


module.exports = (VirtualBagsLog) => {
    _taecelVirtualLog = VirtualBagsLog;

    return {
        getVirtualLog,
        getById
    }
}