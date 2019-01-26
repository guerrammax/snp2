const handler = require('../utils/handler');
const status = require('http-status');

let _branchOffice;

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
  _branchOffice.find(query)
    .exec(handler.handleMany.bind(null, 'branchOffices', res));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getById = (req, res) => {
  const { _id } = req.params;

  let query = {
    _id: _id
  }

  _branchOffice.findOne(query)
    .exec(handler.handleOne.bind(null, 'branchOffice', res));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const create = (req, res) => {
  let _obj = req.body;
  _obj.business = req.params._id;

  _branchOffice.create(_obj, (err, _created) => {
    if (err)
      return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

    res.json({ branchOffice: _created });
  });

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const update = (req, res) => {
  const { _id } = req.params;
  const _obj = req.body;

  const query = { _id: _id };

  _branchOffice.findOneAndUpdate(query, _obj, { new: true })
    .exec(handler.handleOne.bind(null, 'branchOffice', res));
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const remove = (req, res) => {
  const { _id } = req.params;

  let query = { _id: _id };

  _branchOffice.findOneAndUpdate(query, { dropped: new Date() }, { new: true })
    .exec(handler.handleOne.bind(null, 'branchOffice', res));
}

/**
 * 
 */
module.exports = (BranchOffice) => {
  _branchOffice = BranchOffice;
  return ({
    getByBusiness,
    getById,
    create,
    update,
    remove
  });
};