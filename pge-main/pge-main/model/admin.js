const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');

var router = express.Router();
var bodyParser = require('body-parser');
var flash = require('express-flash');

var connection = require('../database');

// Administrador
router.get('/administrador', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		response.render('administrador/main', {message: ""});
		} else {
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/admin_editar', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		
		var usuario = request.session.usuario;
		var senha = "";
		var urlfoto = "";
		
		connection.query('SELECT * FROM login WHERE usuario = ?', [usuario], function (err, result) {
			if (err) {
				request.flash('error', err);
			} 
			senha = result[0].senha;
			urlfoto = result[0].foto;
			response.render('administrador/editar_admin', {
				data: result, message: "", senha: senha, urlfoto: urlfoto
			});
		});
		
		} else {
		// Not logged in
		response.render(path.join('index'), {errormessage: "Faça login para acessar a página!"});
	}
});

router.post('/admin_editado', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		// Capture the input fields
		let usuario = request.body.usuario;
		let senha = request.body.senha;
		let urlfoto = request.body.urlfoto;
		
		connection.query('UPDATE login SET senha = ?, foto = ? WHERE usuario = ?', [senha, urlfoto, usuario], function(error, results, fields) {
			if (error) throw error;
		});
		
		request.session.foto = urlfoto;
		
		response.render('administrador/main', {
			message: "Dados editados com sucesso!"
		});
		
		} else {
		response.render(path.join('index'), {errormessage: "Faça login para acessar a página!"});
	}
});

module.exports = router;