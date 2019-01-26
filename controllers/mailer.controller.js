const nodemailer = require('nodemailer');
const status = require('http-status');
const fs = require('fs');
const handler = require('../utils/handler');
const Cryptr = require('cryptr');

let _user;
let _configuration;
let _business;

/**
 * Function used to send email
 * @param {*} res 
 * @param {*} mailOptions 
 * @param {*} smptOptions 
 * @param {*} resJSON 
 */
const sendEmail = (res, mailOptions, smptOptions, resJSON) => {

	/**
	 * SMTP OPTIONS
	 *  service?: string;
	 *  port?: number;
	 *  host?: string;
	 *  secure?: boolean;
	 *  auth?: AuthOptiBranchOfficeons;
	 * 
	 * AUTH OPTIONS
	 *  user?: string;
	 *  pass?: string;
	 */

	let transporter = nodemailer.createTransport(
		// {
		//     host: smptOptions.host,
		//     port: smptOptions.port,
		//     secure: smptOptions.secure, // true for 465, false for other ports
		//     // service: 'gmail',
		//     auth: smptOptions.auth
		// }
		smptOptions
	);

	/**
	 * MAIL OPTIONS
	 *  from?: string;
 *  to?: string|string[];
	 *  subject?: string;
	 *  html?: string|Buffer|NodeJS.ReadableStream|AttachmentObject;
	 *  attachments?: AttachmentObject[];
	 * 
	 * 
	 * ATTACHMENTS OPTIONS
	 * filename?: string;
 * cid?: string;
 * path?: string;
 */


	// let _mailOptions = {
	//     from: '"' + mailOptions.fromName + '" <' + mailOptions.fromEmail + '>',
	//     to: mailOptions.to,
	//     subject: mailOptions.subject,
	//     // text: 'That was easy!'
	//     html: html
	// };

	transporter.sendMail(mailOptions, (error, info) => {
		console.log(error);
		if (res)
			if (error) {
				return res.status(status.INTERNAL_SERVER_ERROR)
					.json({ status: status.INTERNAL_SERVER_ERROR, message: "La configuración del correo electronico no son correctas" });
			} else {
				return res.status(status.OK)
					.json({ status: status.OK, message: "Se ha enviado el correo correctamente" });
			}
	});
}


/**
 * Send an new user is pending to register
 * @param {*} res 
 * @param {*} resJSON 
 * @param {*} _obj 
 */
const sendEmailRegister = (res, resJSON) => {
	let query = {
		name: 'email'
	};

	_configuration.findOne(query)
		.then(data => {
			fs.readFile((__dirname + '/resources/template-register.html').replace('controllers/', ''), (err, html) => {
				if (err)
					return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

				html = html.toString();
				let _nombre = resJSON.person.firstname + " " + resJSON.person.lastname + " " + resJSON.person.lastname2;
				let _negocio = resJSON.name;
				html = html.replace('@nombre', _nombre);
				html = html.replace('@negocio', _negocio);

				let smptOptions = data.value;

				let mailOptions = {
					from: '"' + 'MX|GLOBALSOLUTIONS' + '" <' + smptOptions.auth.user + '>',
					// from: smptOptions.auth.user,
					to: resJSON.person.email,
					subject: "Preregistro de nueva empresa en QuickSale Prepaid",
					html: html,
					attachments: [
						{
							// __dirname
							filename: 'prepaid-gray.png',
							path: (__dirname + '/resources/src/prepaid-gray.png').replace('controllers/', ''),
							cid: 'prepaid-gray'
						}
					]
				}
				return sendEmail(res, mailOptions, smptOptions, resJSON);
			});
		});
}

/**
 * Send an email when an new user is registered
 * @param {*} res 
 * @param {*} resJSON 
 * @param {*} _obj 
 */
const sendEmailNewUser = (res, resJSON, _obj) => {
	let query = {
		name: 'email'
	};

	_configuration.findOne(query)
		.then(data => {
			fs.readFile((__dirname + '/resources/template-newuser.html').replace('controllers/', ''), (err, html) => {
				if (err)
					return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

				html = html.toString();
				html = html.replace('@nombre', _obj.person.firstname + " " + _obj.person.lastname + " " + _obj.person.lastname2);
				html = html.replace('@usuario', _obj.user);
				html = html.replace('@contraseña', _obj._password);

				let smptOptions = data.value;

				let mailOptions = {
					from: '"' + 'MX|GLOBALSOLUTIONS' + '" <' + smptOptions.auth.user + '>',
					// from: smptOptions.auth.user,
					to: _obj.email,
					subject: "Registro de nuevo usuario QuickSale Prepaid",
					html: html,
					attachments: [
						{
							// __dirname
							filename: 'prepaid-gray.png',
							path: (__dirname + '/resources/src/prepaid-gray.png').replace('controllers/', ''),
							cid: 'prepaid-gray'
						}
					]
				}
				return sendEmail(res, mailOptions, smptOptions, resJSON);
			});
		});
}

// const sendEmailBilling = (res, resJSON, _obj) => {
// 	let query = {
// 		_id: _id
// 	};

// 	_business.findOne(query)
// 		.then(data => {
// 			fs.readFile((__dirname + '/resources/template-register.html').replace('controllers/', ''), (err, html) => {
// 				if (err)
// 					return handler.handleError(res, status.INTERNAL_SERVER_ERROR, err);

// 				html = html.toString();
// 				// html = html.replace('@nombre', _obj.person.firstname + " " + _obj.person.lastname + " " + _obj.person.lastname2);
// 				// html = html.replace('@usuario', _obj.user);
// 				// html = html.replace('@contraseña', _obj._password);

// 				let smptOptions = data.value;

// 				let mailOptions = {
// 					from: '"' + + '" <' + smptOptions.auth.user + '>',
// 					// from: smptOptions.auth.user,
// 					to: _obj.email,
// 					subject: "Registro de nuevo usuario QuickSale Prepaid",
// 					html: html,
// 					attachments: [
// 						{
// 							// __dirname
// 							filename: 'prepaid-gray.png',
// 							path: (__dirname + '/resources/src/prepaid-gray.png').replace('controllers/', ''),
// 							cid: 'prepaid-gray'
// 						}
// 					]
// 				}
// 				return sendEmail(res, mailOptions, smptOptions, resJSON);
// 			});
// 		});
// }

const sendEmailTaecel = () => {
	let query = {
		name: 'email'
	};

	_configuration.findOne(query)
		.then(data => {
			fs.readFile((__dirname + '/resources/template-taecel.html').replace('controllers/', ''), (err, html) => {

				let query2 = {
					control: { $exists: true }
				};

				_user.find(query2)
					.then(data2 => {
						let to = [];

						for (i = 0; i < data2.length; i++) {
							to.push(data2[i].email);
						}

						html = html.toString();

						let smptOptions = data.value;

						let mailOptions = {
							from: '"' + 'MX|GLOBALSOLUTIONS' + '" <' + smptOptions.auth.user + '>',
							// from: smptOptions.auth.user,
							to: to, //_obj.email,
							subject: "Saldo Taecel está por agotarse",
							html: html,
							attachments: [
								{
									// __dirname
									filename: 'prepaid-gray.png',
									path: (__dirname + '/resources/src/prepaid-gray.png').replace('controllers/', ''),
									cid: 'prepaid-gray'
								}
							]
						}
						return sendEmail(null, mailOptions, smptOptions, null);
					});
			});
		});
}

const sendEmailBusinessTest = (res, _obj) => {
	fs.readFile((__dirname + '/resources/template-client-test.html').replace('controllers/', ''), (err, html) => {

		html = html.toString();

		let smptOptions = _obj;

		let to = _obj.auth.user;

		let mailOptions = {
			from: '"' + 'MX|GLOBALSOLUTIONS BOT' + '" <' + smptOptions.auth.user + '>',
			to: to, //_obj.email,
			subject: "Correo de Prueba",
			html: html,
			attachments: [
				{
					filename: 'prepaid-gray.png',
					path: (__dirname + '/resources/src/prepaid-gray.png').replace('controllers/', ''),
					cid: 'prepaid-gray'
				}
			]
		}
		return sendEmail(res, mailOptions, smptOptions, null);
	});
}

const sendEmailBusiness = (res, _obj, emailConfiguration) => {
	fs.readFile((__dirname + '/resources/template-client-email.html').replace('controllers/', ''), (err, html) => {

		html = html.toString();

		let smptOptions = _obj;

		let to = _obj.auth.user;

		let mailOptions = {
			from: '"' + 'MX|GLOBALSOLUTIONS' + '" <' + smptOptions.auth.user + '>',
			to: to, //_obj.email,
			subject: "Correo de Prueba",
			html: html,
			attachments: [
				{
					filename: 'prepaid-gray.png',
					path: (__dirname + '/resources/src/prepaid-gray.png').replace('controllers/', ''),
					cid: 'prepaid-gray'
				}
			]
		}
		return sendEmail(res, mailOptions, smptOptions, null);
	});
}

const sendEmailPDF = (res, _obj) => {
	fs.readFile((__dirname + '/resources/template-client-email.html').replace('controllers/', ''), (err, html) => {

		if (err) {
			res
				.status(status.INTERNAL_SERVER_ERROR)
				.json({
					code: status.INTERNAL_SERVER_ERROR,
					message: "Error al enviar el archivo, contacte con soporte."
				});
		}

		let { person } = _obj;
		let { business } = _obj;

		html = html.toString();

		html = html.replace('@text', `<center><h1><strong>${person.firstname} ${person.lastname}<br></strong> hemos enviado su ticket de compra por esta vía de manera digital, gracias por su compra.</h1></center>`);

		// let query = {
		// 	_id: business
		// };

		// _business.findOne(query)
		// 	.then(data => {

		let query = {
			name: 'email'
		};

		_configuration.findOne(query)
			.then(data => {
				let smptOptions = data.value;

				const cryptr = new Cryptr(require('../config').secret);

				// let smptOptions = {
				// 	host: "secure.emailsrvr.com",
				// 	port: 587,
				// 	secure: false,
				// 	auth: {
				// 		user: "efrain.becerra@mxglobalsolutions.com",
				// 		pass: "MXGSefrain1"
				// 	}
				// }


				if (!smptOptions.host
					|| !smptOptions.port
					// || !smptOptions.secure
					|| !smptOptions.auth.user
					|| !smptOptions.auth.pass) {
					return res.status(status.INTERNAL_SERVER_ERROR)
						.json({ status: status.INTERNAL_SERVER_ERROR, message: "La configuración del correo electronico no son correctas" });
				}
				// smptOptions.auth.pass = cryptr.decrypt(smptOptions.auth.pass);

				let { email } = person;

				let mailOptions = {
					from: '"' + 'MX|GLOBALSOLUTIONS' + '" <' + smptOptions.auth.user + '>',
					to: email,
					subject: "Ticket de compra",
					html: html,
					attachments: [
						{
							filename: 'prepaid-gray.png',
							path: (__dirname + '/resources/src/prepaid-gray.png').replace('controllers/', ''),
							cid: 'prepaid-gray'
						},
						{
							filename: 'ticket.pdf',
							content: new Buffer(_obj._obj, 'base64'),
							contentType: 'application/pdf',
							cid: 'pdf'
						}
					]
				}
				return sendEmail(res, mailOptions, smptOptions, null);
			}).catch(err => { console.log(err) });
	});
}

module.exports = (Business, Configuration, User) => {
	_user = User;
	_business = Business;
	_configuration = Configuration;
	return ({
		sendEmailNewUser,
		sendEmailRegister,
		// sendEmailBilling,
		sendEmailTaecel,
		sendEmailBusinessTest,
		sendEmailBusiness,
		sendEmailPDF
	});
};


