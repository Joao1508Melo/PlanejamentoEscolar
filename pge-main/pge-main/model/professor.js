const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');

var router = express.Router();
var bodyParser = require('body-parser');
var flash = require('express-flash');

var connection = require('../database');

// Professor
router.get('/professor', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		response.render('professor/main', {message: ""});
		} else {
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/professor_editar', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		
		var rp = request.session.usuario;
		var senha = "";
		var urlfoto = "";
		
		connection.query('SELECT * FROM login WHERE usuario = ?', [rp], function (err, result) {
			if (err) {
				request.flash('error', err);
			} 
			senha = result[0].senha;
			urlfoto = result[0].foto;
		});
		
		connection.query('SELECT * FROM professor WHERE rp = ? limit 1', [rp], function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('professor/editar_professor', {
					// EJS variable and server-side variable
					data: "", message: ""
				});
				} else {
				response.render('professor/editar_professor', {
					data: rows, message: "", senha: senha, urlfoto: urlfoto
				});
			}});
			} else {
			response.render(path.join('index'), {errormessage: "Faça login para acessar a página!"});
	}
});

router.post('/professor_editado', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		let rp = request.body.rp;
		let senha = request.body.senha;
		let cpf = request.body.cpf;
		let email = request.body.email;
		let urlfoto = request.body.urlfoto;
		
		connection.query('UPDATE professor SET email = ?, cpf = ? WHERE rp = ?', [email, cpf, rp], function(error, results, fields) {
			if (error) throw error;
		});
		
		connection.query('UPDATE login SET senha = ?, foto = ? WHERE usuario = ?', [senha, urlfoto, rp], function(error, results, fields) {
			if (error) throw error;
		});
		
		request.session.foto = urlfoto;
		
		response.render('professor/main', {
			message: "Dados editados com sucesso!"
		});
		
		} else {
		response.render(path.join('index'), {errormessage: "Faça login para acessar a página!"});
	}
});

// router.get('/frequencia', function(request, response) {
	// if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		// response.render('professor/frequencia/direction_frequencia');
		// } else {
		// response.render('index', {errormessage: "Faça login para acessar a página!"});
	// }
// });

// router.get('/professor_notas', function(request, response) {
	// if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		// response.render('professor/notas/direction_notas');
		// } else {
		// response.render('index', {errormessage: "Faça login para acessar a página!"});
	// }
// });

module.exports = router;