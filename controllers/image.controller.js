// const fs = require('fs');

// exports.saveImage = (req, res) => {

//     const { img } = req.body;

//     let data = img.replace(/^data:image\/\w+;base64,/, "");
//     var buf = new Buffer(data, 'base64');
//     fs.writeFile('image.png', buf, (error) => {
//         if (error)
//             console.log(error)
//         else console.log("Satisfactoriamente guardado")
//     });


//     // it should return the img url
//     return res.json({ status: 200, msg: "Nalgas" });
// }

const handler = require('../utils/handler');

let _image;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getById = (req, res) => {
    const { _id } = req.params;
    const query = {
        _id: _id
    }
    _image.findOne(query)
        .exec(handler.handleOne.bind(null, 'image', res));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const create = (req, res) => {
    const { image } = req.body;
    // _obj.business = req.params._id;

    _image.create(_obj, (err, _created) => {
        if (err)
            return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

        res.json({ image: _created });
    });
}

/**
 * 
 */
module.exports = (Image) => {
    _image = Image;
    return ({
        getById,
        create
    });
};