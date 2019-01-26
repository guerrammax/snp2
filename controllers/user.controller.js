const handler = require('../utils/handler');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');
const status = require('http-status');

let _mailerController;
let _user;
let _business;
let _businessTemporal;
let _branchOffice;
let _configuration;

// const getBybusiness = (req, res) => {
//     // const { start = 0, limit = 10 } = req.query;
//     let { _id } = req.params;

//     let query = {
//         business: _id
//     }

//     // return res.status(200)
//     // json({a: "a"});
//     _user.find(query)
//         // .sort({ name: 1 })
//         // .skip(+start)
//         // .limit(+limit)
//         .exec(handler.handleMany.bind(null, 'users', res));
// };

const getByBusiness = (req, res) => {
	let { _id } = req.params;

	let query = {
		business: _id
	}

	_user.find(query)
		.exec(handler.handleMany.bind(null, 'users', res));
};

const getById = (req, res) => {
	let { _id } = req.params;

	let query = {
		_id: _id
	}

	_user.findOne(query)
		.exec(handler.handleOne.bind(null, 'user', res));
};

// const create = (req, res) => {
//     _user.insert()
//         .exec(handler.handleOne, bind(null, 'user', res));
// }

const update = (req, res) => {
	const { _id } = req.params;
	const data = req.body;

	const query = {
		_id: _id
	}

	_user.findOneAndUpdate(query)
		.exec(handler.handleOne, bind(null, 'user', res));
}

const remove = (req, res) => {
	// const { _id } = req.params;

	// const options = {
	//     select: ''
	// }

	// _user.findByIdAndRemove(_id, options)
	//     .exec((err, deleted) => {
	//         if (err)
	//             return res.status(s.INTERNAL_SERVER_ERROR).json({
	//                 error: err.toString()
	//             });

	//         res.json({ user: deleted });
	//     });

}

const login = (req, res) => {	
	console.log(req.body);
	const { email } = req.body;
	const { password } = req.body;

	let query = {
		$or: [{ user: email }, { email: email }]
	};

	_user.findOne(query)
		.populate('business')
		.populate('branchOffice')
		.then(data => {
			if (data)
				bcrypt.compare(password, data.password, (err, dataBcrypt) => {
					if (dataBcrypt) {
						token = jwt.sign({ email: email, date: new Date(), _id: data._id }, config.secret);
						return res.status(status.OK)
							.json({ user: data, token: token });
					}
					else
						return res.status(status.NOT_FOUND)
							.json({
								status: status.NOT_FOUND,
								message: "Contraseña incorrecta."
							});
				});
			else
				return res.status(status.NOT_FOUND)
					.json({
						status: status.NOT_FOUND,
						message: "Usuario no registrado."
					});
		})
		.catch(err => {
			return handler.handleError(res, status.NOT_FOUND, err);
		});
}

const signup = (req, res) => {
	let _json = req.body;

	let query = {
		$or: [{ "person.email": _json.person.email }, { "person.phone": _json.person.phone }]
	};

	_user.findOne(query)
		.exec((err, _founded) => {
			if (err)
				return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

			if (_founded)
				return res
					.status(status.CONFLICT)
					.json({
						status: status.CONFLICT,
						message: "Correo ó número telefónico ya registrado."
					});

			_businessTemporal.findOne(query)
				.exec((err, _founded2) => {
					if (err)
						return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

					if (_founded2)
						return res
							.status(status.INTERNAL_SERVER_ERROR)
							.json({
								status: status.INTERNAL_SERVER_ERROR,
								message: "Solicitud de registro previamente realizada con su correo ó número telefónico."
							});

					let proj = { _id: 1 };

					_businessTemporal.findOneAndUpdate(_json, _json, {
						upsert: true,
						new: true,
						strict: true
					}, (err, _founded3) => {
						if (err)
							return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

						_mailerController.sendEmailRegister(res, _founded3);

						return res.status(status.OK)
							.json(_founded3);
					});
				});
		});

	/**
	 * TOKEN JWT
	 */

	// /*const*/let { user, password } = req.body;
	// user = "alejandro", password = "steven123";

	// token = jwt.sign({ user: user, date: new Date(), _id: 123456789 }, config.secret);

	// let a = jwt.decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWxlamFuZHJvIiwiZGF0ZSI6IjIwMTctMDktMjhUMjE6Mzg6NDEuMzczWiIsImlhdCI6MTUwNjYzNDcyMX0.6pxCN28iZuOy4ws_9aVD-3pk-48ZY9RIejEACfZCRZY");

	// console.log(req.headers['authorization'])
	// console.log(a)
	// console.log(new Date())
	// console.log(req.headers);


	/**
	 * BCRYPT
	 */

	// const saltRounds = "S0lut10ns!".length;

	//     bcrypt.genSalt(saltRounds, (err, salt) => {
	//         bcrypt.hash("bacon", salt, (err, hash) => {
	//             // bcrypt.compare("bacon", hash, (err, data) => {
	//             //     console.log(data)
	//             // });

	//             // bcrypt.compare("bacon", "$2a$10$RznKt9IAJ63jMkksrQipIOPIeAqFy9eIK1oR22Zqe00Y.8vKlWdb6", (err, data) => {
	//             //     console.log(data)
	//             // });

	//             res.json({a: "a"});

	//         });
	//     });

	// Load hash from your password DB.
	// bcrypt.compare("bacon", hash, function(err, res) {
	//     // res == true
	// });

}

const verifyEmail = (req, res) => {
	// let _json = req.body;
	let _json = req.query;

	let query = {
		$or: [{ "person.email": _json.email }]
	};

	_user.findOne(query)
		.exec((err, _founded) => {
			if (err)
				return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

			if (_founded)
				return res
					.status(status.INTERNAL_SERVER_ERROR)
					.json({
						status: status.INTERNAL_SERVER_ERROR,
						message: "Correo ya registrado."
					});

			_businessTemporal.findOne(query)
				.exec((err, _founded2) => {
					if (err)
						return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

					if (_founded2)
						return res
							.status(status.INTERNAL_SERVER_ERROR)
							.json({
								status: status.INTERNAL_SERVER_ERROR,
								message: "Solicitud de registro previamente realizada con su correo."
							});

					else
						return res
							.status(status.OK)
							.json({
								status: status.OK,
								message: "Correo disponible."
							});
				});
		});
}

const verifyPhone = (req, res) => {
	let _json = req.query;

	let query = {
		$or: [{ "person.phone": _json.phone }]
	};

	_user.findOne(query)
		.exec((err, _founded) => {
			if (err)
				return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

			if (_founded)
				return res
					.status(status.INTERNAL_SERVER_ERROR)
					.json({
						status: status.INTERNAL_SERVER_ERROR,
						message: "Teléfono ya registrado."
					});

			_businessTemporal.findOne(query)
				.exec((err, _founded2) => {
					if (err)
						return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

					if (_founded2)
						return res
							.status(status.INTERNAL_SERVER_ERROR)
							.json({
								status: status.INTERNAL_SERVER_ERROR,
								message: "Solicitud de registro previamente realizada con su teléfono."
							});

					else
						return res
							.status(status.OK)
							.json({
								status: status.OK,
								message: "Teléfono disponible."
							});
				});
		});

}

const register = (req, res) => {
	const _json = req.body;
	const { _id } = req.params;

	const { quantity } = _json;
	const { license } = _json;

	const query = {
		_id: _id
	}

	_businessTemporal.findOne(query)
		.exec((err, _founded) => {
			if (err)
				return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

			if (!_founded)
				return res
					.status(status.INTERNAL_SERVER_ERROR)
					.json({
						status: status.INTERNAL_SERVER_ERROR,
						message: "Recurso no encontrado."
					});

			let _obj = {
				person: _founded.person,
				name: _founded.name,
				address: _founded.address,
				taecelStock: {
					quantity: quantity ? quantity : 0
				},
				license: license ? license : new Date()
			};

			_business.create(_obj, (err, _founded2) => {
				if (err)
					return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

				let _obj2 = {
					business: _founded2._id,
					name: _founded2.name + " CENTRAL",
					person: _founded2.person
				}

				_branchOffice.create(_obj2, (err, _founded3) => {
					if (err)
						return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

					var password = ("pw" + _founded.name.replace(/ /g, "") + parseInt(Math.random() * 1000)).toLowerCase();
					let saltRounds = "S0lut10ns!".length;

					bcrypt.genSalt(saltRounds, (err, salt) => {
						bcrypt.hash(password, salt, (err, hash) => {

							let _obj3 = {
								person: _founded.person,
								user: ("u" + _founded.name.replace(/ /g, "")).toLowerCase(),
								password: hash,
								email: _founded.person.email,
								business: _founded2._id,
								branchOffice: _founded3._id
							}

							_user.create(_obj3, (err, _founded4) => {
								if (err)
									return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

								_founded4._password = password;
								_businessTemporal.remove({ _id: _founded._id }, (err) => {
									// name, email, user, password
									let resJSON = {
										business: _founded2,
										branchOffice: _founded3,
										user: _founded4
									};

									_mailerController.sendEmailNewUser(res, resJSON, _founded4);
								});
							});
						});
					});
				});
			});
		});
};

const changePassword = (req, res) => {

	const { email } = req.body;
	const { password } = req.body;
	const { newPassword } = req.body;

	let query = { email: email };

	_user.findOne(query)
		// .populate('business')
		// .populate('branchOffice')
		.then(data => {
			if (data)
				bcrypt.compare(password, data.password, (err, dataBcrypt) => {

					if (dataBcrypt) {

						let saltRounds = "S0lut10ns!".length;

						bcrypt.genSalt(saltRounds, (err, salt) => {
							bcrypt.hash(newPassword, salt, (err, hash) => {
								_user.findOneAndUpdate(query, { password: hash }, { new: true })
									.exec(handler.handleOne.bind(null, 'user', res));
							});
						});

					} else {
						return res.status(status.INTERNAL_SERVER_ERROR)
							.json({
								status: status.INTERNAL_SERVER_ERROR,
								message: "La contraseña anterior es incorrecta."
							});
					}

				});
			else
				return res.status(status.NOT_FOUND)
					.json({
						status: status.NOT_FOUND,
						message: "Correo no registrado."
					});
		})
		.catch(err => {
			return handler.handleError(res, status.NOT_FOUND, err);
		});
}

module.exports = (User, Business, BusinessTemporal, BranchOffice, Configuration) => {
	const mailerController = require('../controllers/mailer.controller')(Business, Configuration, User);
	_mailerController = mailerController;
	_user = User;
	_business = Business;
	_businessTemporal = BusinessTemporal;
	_branchOffice = BranchOffice;
	_configuration = Configuration;

	return ({
		getByBusiness,
		getById,
		update,
		remove,
		login,
		signup,
		register,
		changePassword,
		verifyEmail,
		verifyPhone
	});
};