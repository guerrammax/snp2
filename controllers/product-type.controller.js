const handler = require('../utils/handler');

let _productType;

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
    _productType.find(query)
        .exec(handler.handleMany.bind(null, 'productTypes', res));
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

    _productType.findOne(query)
        .exec(handler.handleOne.bind(null, 'productType', res));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const create = (req, res) => {
    let _obj = req.body;
    let { _id } = req.params;
    _obj.business = _id;
    
    _productType.create(_obj, (err, _created) => {
        if (err)
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

        res.json({ productType: _created });
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

    _productType.findOneAndUpdate(query, _obj, { new: true })
        .exec(handler.handleOne.bind(null, 'productType', res));
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const remove = (req, res) => {
    const { _id } = req.params;

    let query = { _id: _id };

    _productType.findOneAndUpdate(query, { dropped: new Date() }, { new: true })
        .exec(handler.handleOne.bind(null, 'productType', res));
}
/**
 * 
 */
module.exports = (ProductType) => {
    _productType = ProductType;
    return ({
        getByBusiness,
        getById,
        create,
        update,
        remove
    });
};