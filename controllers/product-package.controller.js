const handler = require('../utils/handler');

let _productPackage;

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
    _productPackage.find(query)
        .exec(handler.handleMany.bind(null, 'productPackages', res));
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

    _productPackage.findOne(query)
        .exec(handler.handleOne.bind(null, 'productPackage', res));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const create = (req, res) => {
    let _obj = req.body;
    _obj.business = req.params._id;

    _productPackage.create(_obj, (err, _created) => {
        if (err)
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

        res.json({ productPackage: _created });
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

    _productPackage.findOneAndUpdate(query, _obj, { new: true })
        .exec(handler.handleOne.bind(null, 'productPackage', res));
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const remove = (req, res) => {
    const { _id } = req.params;

    let query = { _id: _id };

    _productPackage.findOneAndUpdate(query, { dropped: new Date() }, { new: true })
        .exec(handler.handleOne.bind(null, 'productPackage', res));
}

/**
 * 
 */
module.exports = (ProductPackage) => {
    _productPackage = ProductPackage;
    return ({
        getByBusiness,
        getById,
        create,
        update,
        remove
    });
};