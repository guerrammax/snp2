const handler = require('../utils/handler');

let _productCategory;

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
    _productCategory.find(query)
        .exec(handler.handleMany.bind(null, 'productCategories', res));
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

    _productCategory.findOne(query)
        .exec(handler.handleOne.bind(null, 'productCategory', res));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const create = (req, res) => {
    let _obj = req.body;
    _obj.business = req.params._id;

    _productCategory.create(_obj, (err, _created) => {
        if (err)
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

        res.json({ productCategory: _created });
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

    _productCategory.findOneAndUpdate(query, _obj, { new: true })
        .exec(handler.handleOne.bind(null, 'productCategory', res));
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const remove = (req, res) => {
    const { _id } = req.params;

    let query = { _id: _id };

    _productCategory.findOneAndUpdate(query, { dropped: new Date() }, { new: true })
        .exec(handler.handleOne.bind(null, 'productCategory', res));
}
/**
 * 
 */
module.exports = (ProductCategory) => {
    _productCategory = ProductCategory;
    return ({
        getByBusiness,
        getById,
        create,
        update,
        remove
    });
};