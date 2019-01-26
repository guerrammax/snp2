const status = require('http-status');
const request = require('request');
const url = require('../data/taecel').url;
const handler = require('../utils/handler');

let _mailerController;
let _business;
let _sale;
let _configuration;
let _user;

const getBalance = (req, res) => {
	let form = require('../data/taecel').form;
	request.post({ url: `${url}/getBalance`, form: form }, (err, httpResponse, body) => {
		return res
			.status(status.OK)
			.json(JSON.parse(body));

	});
}

const requestTXN = (req, res) => {
	//Codigo de Producto Obtenido desde el metodo getProducts
	//Numero telefonico o referencia de pago de acuerdo al tipo de operacion a realizar

	const { product } = req.body;
	const { reference } = req.body;
	const { business } = req.body;
	const { user } = req.body;
	const { quantity } = req.body;

	if (!product || !reference || !business || !user)
		return handler.handleError(res, status.INTERNAL_SERVER_ERROR, { message: 'Error en el servidor' })

	let form = require('../data/taecel').form;
	form.producto = product;
	form.referencia = reference;
	if (quantity)
		form.monto = parseFloat(quantity);

	request.post({ url: `${url}/RequestTXN`, form: form }, (err, httpResponse, body) => {
		if (err)
			return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

		let response = JSON.parse(body);

		if (response.success) {

			let { transID } = response.data;
			form.transID = transID;

			/**
			 * Consultar el estado de la transaccion realizada
			 */
			request.post({ url: `${url}/statusTXN/${transID}`, form: form }, (err2, httpResponse2, body2) => {
				if (err2)
					return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err2);

				let response2 = JSON.parse(body2);

				if (response2.data["Saldo Final"]) {
					let saldoFinal = parseFloat(response2.data["Saldo Final"].replace('$', ''));
					if (saldoFinal < 500) {
						_mailerController.sendEmailTaecel();
					}
				}

				/**
				 * En caso de ser la transaccion exitosa
				 */
				if (response2.success) {

					let monto = parseFloat(response2.data.Monto.replace('$', ''));

					let type;
					if (response2.data.Bolsa == 'Tiempo Aire')
						type = 'Recarga';
					if (response2.data.Bolsa == 'Pago de Servicios')
						type = 'Servicio';

					let sale = {
						products: [{
							product: {
								name: response2.data.Carrier,
								description: response2.data.Telefono,
								finalPrice: monto,
								billing33: '83111603',								
								tax: {
									iva: 16
								},
								detail: response2
							},
							quantity: 1
						}],
						date: new Date(),
						user: user,
						type: type,
						business: business
					}					
					_sale.create(sale, (err, _created) => {					
						if (err)
							return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

						let decQuery = {
							_id: business
						};

						let decObj;
						if (type == 'Recarga') {
							decObj = {
								$inc: {
									"taecelStock.quantity": -monto
								}
							};
						}
						else {
							decObj = {
								$inc: {
									"taecelService.quantity": -monto
								}
							};
						}


						// _user.findOne(query)
						// 	.populate('business')
						// 	.populate('branchOffice')
						// 	.then(data => { });

						_business.findOneAndUpdate(decQuery, decObj, { new: true }, (err, _created2) => {
							if (err)
								return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

							//insertar aqui lo que falta
							_taecelSale.create({ business: business, detail: response2 }, (err, _created2) => {
								if (err)
									return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

								return res
									.status(status.OK)
									.json({ sale: _created });
							});

						});
						// if (err)
						// 	return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

						// return res
						// 	.status(status.OK)
						// 	.json({ sale: _created });
					});
				} else {
					return res
						.status(status.INTERNAL_SERVER_ERROR)
						.json({
							status: status.INTERNAL_SERVER_ERROR,
							message: response2.message ? response2.message : "Error en el servidor"
						});
				}
			});
		} else {
			return res
				.status(status.INTERNAL_SERVER_ERROR)
				.json({
					status: status.INTERNAL_SERVER_ERROR,
					message: response.message ? response.message : "Error en el servidor"
				});
		}
	});
}

const statusTXN = (req, res) => {
	//Dato obtenido desde el metodo RequestTXN
	const { transID } = req.params;

	let form = require('../data/taecel').form;
	form.transID = transID;

	request.post({ url: `${url}/StatusTXN`, form: form }, (err, httpResponse, body) => {
		res.json(JSON.parse(body));
	});
}

const getProducts = (req, res) => {
	let form = require('../data/taecel').form;
	request.post({ url: `${url}/getProducts`, form: form }, (err, httpResponse, body) => {
		res.json(JSON.parse(body));
	});
}

const getSales = (req, res) => {
	// Consulting date in format YYYY-MM-DD
	const { date } = req.params;
	let form = require('../data/taecel').form;
	form.fecha = date;
	request.post({ url: `${url}/getSales`, form: form }, (err, httpResponse, body) => {
		res.json(JSON.parse(body));
	});
}

module.exports = (Business, Sale, Configuration, User, TaecelSale) => {
	const mailerController = require('../controllers/mailer.controller')(Business, Configuration, User, TaecelSale);
	_mailerController = mailerController;
	_business = Business;
	_sale = Sale;
	_taecelSale = TaecelSale;
	_configuration = Configuration;
	_user = User;

	return ({
		getBalance,
		requestTXN,
		statusTXN,
		getProducts,
		getSales
	});
}

// getBalance();
// requestTXN('UNE030', 3112484460);
// statusTXN('170700400288');
// getProducts();
// getSales('2017-07-13'); 170900472779