const handler = require('../utils/handler');

let _client;


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getByNameSearch = (req, res) => {
  const { _id } = req.params;
  const { name } = req.query;

  let query = {
    business: _id,
    "person.firstname": { $regex: name }
    // $text: { $search: name }
  }

  _client.find(query)
    .exec(handler.handleMany.bind(null, 'clients', res));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getByBusiness = (req, res) => {
  const { _id } = req.params;
  const query = {
    business: _id
  }
  _client.find(query)
    .exec(handler.handleMany.bind(null, 'clients', res));
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

  _client.findOne(query)
    .exec(handler.handleOne.bind(null, 'client', res));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const create = (req, res) => {
  const _obj = req.body;
  _obj.business = req.params._id;

  _client.create(_obj, (err, _created) => {
    if (err)
      return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

    res.json({ client: _created });
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

  _client.findOneAndUpdate(query, _obj, { new: true })
    .exec(handler.handleOne.bind(null, 'client', res));
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const remove = (req, res) => {
  const { _id } = req.params;

  const query = { _id: _id };

  _client.findOneAndUpdate(query, { dropped: new Date() }, { new: true })
    .exec(handler.handleOne.bind(null, 'client', res));
}

/**
 * 
 */
module.exports = (Client) => {
  _client = Client;
  return ({
    getByNameSearch,
    getByBusiness,
    getById,
    create,
    update,
    remove
  });
};