const handler = require('../utils/handler');

let _billing33Product;
let _billing33Unit;

const searchBilling33Product = (req, res) => {
  const { search } = req.params;  
  let query = {
    description: {
      $regex: new RegExp(search, 'i')
    }
  };

  _billing33Product.find(query)
    .exec(handler.handleMany.bind(null, 'billing33products', res));
};


const searchBilling33ProductCode = (req, res) => {
  const { search } = req.params;

  let query = {
    code: {
      $regex: new RegExp(search, 'i')
    }
  };

  _billing33Product.find(query)
    .exec(handler.handleMany.bind(null, 'billing33products', res));
};



const searchBilling33Unit = (req, res) => {
  const { search } = req.params;

  let query = {
    description: {
      $regex: new RegExp(search, 'i')
    }
  };

  _billing33Unit.find(query)
    .exec(handler.handleMany.bind(null, 'billing33units', res));
};


const searchBilling33UnitCode = (req, res) => {
  const { search } = req.params;

  let query = {
    code: {
      $regex: new RegExp(search, 'i')
    }
  };

  _billing33Unit.find(query)
    .exec(handler.handleMany.bind(null, 'billing33units', res));
};


module.exports = (Billing33Product, Billing33Unit) => {
  _billing33Product = Billing33Product;
  _billing33Unit = Billing33Unit;
  return ({
    searchBilling33Product,
    searchBilling33ProductCode,
    searchBilling33Unit,
    searchBilling33UnitCode,
  });
};