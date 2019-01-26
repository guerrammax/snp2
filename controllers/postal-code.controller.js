const handler = require('../utils/handler');

let _postalCode;

const getPostalCode = (req, res) => {
  const { postalCode } = req.query;
  
  query = {
    code: postalCode
  }

  _postalCode.findOne(query)
      .exec(handler.handleOne.bind(null, 'postalCode', res));
};

module.exports = (PostalCode) => {
  _postalCode = PostalCode;
  return ({
    getPostalCode
  });
};