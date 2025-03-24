const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');

var router = express.Router();
var bodyParser = require('body-parser');
var flash = require('express-flash');

var connection = require('../database');

// Administrador Disciplina

router.get('/administrador_disciplina', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		// Render login template
		connection.query('SELECT * FROM disciplina ORDER BY nome', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/disciplina/disciplina', {
					// EJS variable and server-side variable
					data: "", message: ""
				});
				} else {
				response.render('administrador/disciplina/disciplina', {
					data: rows, message: ""
				});
			}
		});
		} else {
		// Not logged in
	response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/administrador_disciplina_excluir', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		var codigo = request.query.codigo;
		connection.query('DELETE FROM disciplina WHERE codigo = ?', [codigo], function (err, rows) {
			if (err) {
				request.flash('error', err);
				connection.query('SELECT * FROM disciplina ORDER BY codigo', function (err, rows) {
					response.render('administrador/disciplina/disciplina', {
						// EJS variable and server-side variable
						data: rows, message: "Não foi possível excluir a disciplina! A disciplina é muito importante!"
					});
				});
				} else {
				
				connection.query('SELECT * FROM disciplina ORDER BY codigo', function (err, rows) {
					if (err) {
						request.flash('error', err);
						response.render('administrador/disciplina/disciplina', {
							// EJS variable and server-side variable
							data: rows, message: "Não foi possível excluir a disciplina! A disciplina é muito importante!"
						});
						} else {
						response.render('administrador/disciplina/disciplina', {
							data: rows, message: "Disciplina excluída com sucesso!"
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

router.get('/administrador_disciplina_cadastro', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		
		connection.query('SELECT * FROM professor', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/disciplina/cad_disciplina', {
					// EJS variable and server-side variable
					data: "", message: ""
				});
				} else {
				response.render('administrador/disciplina/cad_disciplina', {
					data: rows, message: ""
					
				});
			}});
			
			} else {
			// Not logged in
			response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.post('/administrador_disciplina_cadastrado', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		// Capture the input fields
		let codigo = request.body.codigo;
		let nome = request.body.nome;
		let rp_professor = request.body.rp_professor;
		
		connection.query('SELECT codigo FROM disciplina WHERE codigo = ? LIMIT 1', [codigo], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				
				connection.query('SELECT * FROM professor', function (err, rows) {
					if (err) {
						request.flash('error', err);
						response.render('administrador/disciplina/cad_disciplina', {
							data: "", message: "Disciplina não cadastrada! O código já está cadastrado!"
						});
						} else {
						response.render('administrador/disciplina/cad_disciplina', {
							data: rows, message: "Disciplina não cadastrada! O código já está cadastrado!"
						});
					}});
					
					} else {
					connection.query('INSERT INTO disciplina (codigo, nome, rp_professor) values (?,?,?)', [codigo, nome, rp_professor], function(error, results, fields) {
						if (error) throw error;
						
						
						connection.query('SELECT * FROM professor', function (err, rows) {
							if (err) {
								request.flash('error', err);
								response.render('administrador/disciplina/cad_disciplina', {
									// EJS variable and server-side variable
									data: "", message: ""
								});
								} else {
								response.render('administrador/disciplina/cad_disciplina', {
									data: rows, message: "Disciplina cadastrada com sucesso!"
								});
							}});
							
					});
			}			
		});
		// response.end();
		} else {
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/administrador_disciplina_editar', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		
		var codigo = request.query.codigo;
		connection.query('SELECT * FROM disciplina WHERE codigo = ? limit 1', [codigo], function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/disciplina/editar_disciplina', {
					// EJS variable and server-side variable
					data: "", message: "", datac: ""
				});
				} else {
				connection.query('SELECT * FROM professor', function (err, cows) {
					if (err) {
						request.flash('error', err);
						response.render('administrador/disciplina/editar_disciplina', {
							// EJS variable and server-side variable
							data: "", message: "", datac: ""
						});
						} else {
						response.render('administrador/disciplina/editar_disciplina', {
							data: rows, message: "", datac: cows
							
						});
					}});
			}});
			
			} else {
			// Not logged in
			response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.post('/administrador_disciplina_editado', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		let codigo = request.body.codigo;
		let nome = request.body.nome;
		let rp_professor = request.body.rp_professor;
		
		connection.query('UPDATE disciplina SET nome = ?, rp_professor = ? WHERE codigo = ?', [nome, rp_professor, codigo], function(error, results, fields) {
			if (error) throw error;
		});
		
		connection.query('SELECT * FROM disciplina ORDER BY nome', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/disciplina/disciplina', {
					data: "", message: ""
				});
				} else {
				response.render('administrador/disciplina/disciplina', {
					data: rows, message: "Disciplina editada com sucesso!"
				});
			}
		});
		} else {
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

module.exports = router;