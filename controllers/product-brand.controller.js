const handler = require('../utils/handler');

let _productBrand;

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
    _productBrand.find(query)
        .exec(handler.handleMany.bind(null, 'productBrands', res));
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

    _productBrand.findOne(query)
        .exec(handler.handleOne.bind(null, 'productBrand', res));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const create = (req, res) => {
    let _obj = req.body;
    _obj.business = req.params._id;

    _productBrand.create(_obj, (err, _created) => {
        if (err)
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

        res.json({ productBrand: _created });
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

    _productBrand.findOneAndUpdate(query, _obj, { new: true })
        .exec(handler.handleOne.bind(null, 'productBrand', res));
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const remove = (req, res) => {
    const { _id } = req.params;

    let query = { _id: _id };

    _productBrand.findOneAndUpdate(query, { dropped: new Date() }, { new: true })
        .exec(handler.handleOne.bind(null, 'productBrand', res));
}
/**
 * 
 */
module.exports = (ProductBrand) => {
    _productBrand = ProductBrand;
    return ({
        getByBusiness,
        getById,
        create,
        update,
        remove
    });
};