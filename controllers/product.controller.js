const handler = require('../utils/handler');
const status = require('http-status');

let _product;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getByNameSearch = (req, res) => {
    const { _id } = req.params;//Id en la URL
    const { name } = req.query;//?options

    let query = {
        business: _id,
        name:
        {
            $regex: new RegExp(name, 'i')
        }
    }
    
    _product.find(query)
        .populate('business')
        .populate('productBrand')
        .populate('productCategory')
        .populate('productPackage')
        //.populate('productType')
        .populate('productUnit')
        .exec(handler.handleMany.bind(null, 'products', res));
};





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
    _product.find(query)
        .populate('business')
        .populate('productBrand')
        .populate('productCategory')
        .populate('productPackage')
        //.populate('productType')
        .populate('productUnit')
        .exec(handler.handleMany.bind(null, 'products', res));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getByProductType = (req, res) => {
    let { productType } = req.params;

    let query = {
        productType: productType
    }

    _product.find(query)
        .populate('business')
        .populate('productBrand')
        .populate('productCategory')
        .populate('productPackage')
        //.populate('productType')
        .populate('productUnit')
        .exec(handler.handleMany.bind(null, 'products', res));
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

    _product.findOne(query)
        .exec(handler.handleOne.bind(null, 'product', res));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const create = (req, res) => {
    let _obj = req.body;
    _obj.business = req.params._id;

    _product.create(_obj, (err, _created) => {
        if (err)
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

        res.json({ product: _created });
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

    _product.findOneAndUpdate(query, _obj, { new: true })
        .exec(handler.handleOne.bind(null, 'product', res));
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const remove = (req, res) => {
    const { _id } = req.params;

    let query = { _id: _id };

    _product.findOneAndUpdate(query, { dropped: new Date() }, { new: true })
        .exec(handler.handleOne.bind(null, 'product', res));
}

/**
 * 
 */
module.exports = (Product) => {
    _product = Product;

    return ({
        getByNameSearch,
        getByBusiness,
        getByProductType,
        getById,
        create,
        update,
        remove
    });
};