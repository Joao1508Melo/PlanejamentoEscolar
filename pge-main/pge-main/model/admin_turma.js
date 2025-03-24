const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');

var router = express.Router();
var bodyParser = require('body-parser');
var flash = require('express-flash');

var connection = require('../database');

// Administrador Turma

router.get('/administrador_turma', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		// Render login template
		connection.query('SELECT * FROM turma ORDER BY nome', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/turma/turma', {
					// EJS variable and server-side variable
					data: "", message: ""
				});
				} else {
				response.render('administrador/turma/turma', {
					data: rows, message: ""
				});
			}
		});
		} else {
		// Not logged in
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/administrador_turma_excluir', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		var codigo = request.query.codigo;
		connection.query('DELETE FROM turma WHERE codigo = ?', [codigo], function (err, rows) {
			if (err) {
				connection.query('SELECT * FROM turma ORDER BY nome', function (err, rows) {
					if (err) {
						request.flash('error', err);
						response.render('administrador/turma/turma', {
							// EJS variable and server-side variable
							data: "", message: "A turma não pode ser excluída! Ela é muito importante!"
						});
						} else {
						response.render('administrador/turma/turma', {
							data: rows, message: "A turma não pode ser excluída! Ela é muito importante!"
						});
					}
				});
				} else {
				
				connection.query('SELECT * FROM turma ORDER BY nome', function (err, rows) {
					if (err) {
						request.flash('error', err);
						response.render('administrador/turma/turma', {
							// EJS variable and server-side variable
							data: "", message: ""
						});
						} else {
						response.render('administrador/turma/turma', {
							data: rows, message: "Turma excluída com sucesso!"
						});
					}
				});
			}
		});
		} else {
		// Not logged in
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/administrador_turma_cadastro', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		
		response.render('administrador/turma/cad_turma', {
			data: "", message: ""
		});
		
		} else {
		// Not logged in
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.post('/administrador_turma_cadastrado', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		// Capture the input fields
		let codigo = request.body.codigo;
		let nome = request.body.nome;
		let sala = request.body.sala;
		
		connection.query('SELECT codigo FROM turma WHERE codigo = ? LIMIT 1', [codigo], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				response.render('administrador/turma/cad_turma', {
					// EJS variable and server-side variable
					data: "", message: "Turma não cadastrada! O código já está cadastrado!"
				});
				} else {
				connection.query('INSERT INTO turma (codigo, nome, sala) values (?,?,?)', [codigo, nome, sala], function(error, results, fields) {
					if (error) throw error;
					response.render('administrador/turma/cad_turma', {
						data: "", message: "Turma cadastrada com sucesso!"
					});
				});
			}			
		});
		// response.end();
		} else {
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/administrador_turma_editar', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		
		var codigo = request.query.codigo;
		connection.query('SELECT * FROM turma WHERE codigo = ? limit 1', [codigo], function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/turma/editar_turma', {
					// EJS variable and server-side variable
					data: "", message: ""
				});
				} else {
				response.render('administrador/turma/editar_turma', {
					data: rows, message: ""
				});
			}});
			} else {
			response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.post('/administrador_turma_editado', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		let codigo = request.body.codigo;
		let nome = request.body.nome;
		let sala = request.body.sala;
		
		connection.query('UPDATE turma SET nome = ?, sala = ? WHERE codigo = ?', [nome, sala, codigo], function(error, results, fields) {
			if (error) throw error;
		});
		
		connection.query('SELECT * FROM turma ORDER BY nome', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/turma/turma', {
					data: "", message: ""
				});
				} else {
				response.render('administrador/turma/turma', {
					data: rows, message: "Turma editada com sucesso!"
				});
			}
		});
		} else {
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

module.exports = router;