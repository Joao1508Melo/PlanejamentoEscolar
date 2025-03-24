const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');

var router = express.Router();
var bodyParser = require('body-parser');
var flash = require('express-flash');

var connection = require('../database');

// Administrador Professor

router.get('/administrador_professor', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		// Render login template
		connection.query('SELECT * FROM professor ORDER BY nome', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/professor/professor', {
					// EJS variable and server-side variable
					data: "", message: ""
				});
				} else {
				response.render('administrador/professor/professor', {
					data: rows, message: ""
				});
			}
		});
		} else {
		// Not logged in
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/administrador_professor_excluir', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		var rp = request.query.rp;
		connection.query('DELETE FROM professor WHERE rp = ?', [rp], function (err, rows) {
			if (err) {
				request.flash('error', err);
				connection.query('SELECT * FROM professor ORDER BY nome', function (err, rows) {
					if (err) {
						request.flash('error', err);
						response.render('administrador/professor/professor', {
							// EJS variable and server-side variable
							data: "", message: ""
						});
						} else {
						response.render('administrador/professor/professor', {
							data: rows, message: "O professor não pode ser excluído! Ele é muito importante!"
						});
					}
				});
				} else {
				
				connection.query('DELETE FROM login WHERE usuario = ?', [rp], function (err, rows) {
					if (err) {
						request.flash('error', err);
					} 
				});
				
				connection.query('SELECT * FROM professor ORDER BY nome', function (err, rows) {
					if (err) {
						request.flash('error', err);
						response.render('administrador/professor/professor', {
							// EJS variable and server-side variable
							data: "", message: ""
						});
						} else {
						response.render('administrador/professor/professor', {
							data: rows, message: "Professor excluído com sucesso!"
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

router.get('/administrador_professor_cadastro', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		
		response.render('administrador/professor/cad_professor', {
			data: "", message: ""
		});
		
		} else {
		// Not logged in
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.post('/administrador_professor_cadastrado', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		// Capture the input fields
		let rp = request.body.rp;
		let nome = request.body.nome;
		let cpf = request.body.cpf;
		let email = request.body.email;
		let nasc = request.body.nasc;
		
		
		connection.query('SELECT professor.rp, aluno.ra FROM professor right join aluno on professor.rp = aluno.ra  WHERE aluno.ra = ? OR professor.rp = ? LIMIT 1', [rp, rp], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				response.render('administrador/professor/cad_professor', {
					// EJS variable and server-side variable
					data: "", message: "Professor não cadastrado! O RP já está cadastrado!"
				});
				} else {
				connection.query('INSERT INTO professor (rp, nome, cpf, email, nasc) values (?,?,?,?,?)', [rp, nome, cpf, email, nasc], function(error, results, fields) {
					if (error) throw error;
				});
				
				connection.query('INSERT INTO login (usuario, senha, tipo_usuario) values (?,?,"professor")', [rp, nasc], function(error, results, fields) {
					if (error) throw error;
					response.render('administrador/professor/cad_professor', {
						data: "", message: "Professor cadastrado com sucesso!"
					});
				});
			}			
		});
		// response.end();
		} else {
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/administrador_professor_editar', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		
		var rp = request.query.rp;
		connection.query('SELECT * FROM professor WHERE rp = ? limit 1', [rp], function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/professor/editar_professor', {
					// EJS variable and server-side variable
					data: "", message: ""
				});
				} else {
				response.render('administrador/professor/editar_professor', {
					data: rows, message: ""
				});
			}});
			} else {
			response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.post('/administrador_professor_editado', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		let rp = request.body.rp;
		let nome = request.body.nome;
		let cpf = request.body.cpf;
		let email = request.body.email;
		let nasc = request.body.nasc;
		
		connection.query('UPDATE professor SET nome = ?, email = ?, nasc = ?, cpf = ? WHERE rp = ?', [nome, email, nasc, cpf, rp], function(error, results, fields) {
			if (error) throw error;
		});
		
		connection.query('SELECT * FROM professor ORDER BY nome', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/professor/professor', {
					data: "", message: ""
				});
				} else {
				response.render('administrador/professor/professor', {
					data: rows, message: "Professor editado com sucesso!"
				});
			}
		});
		} else {
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

module.exports = router;