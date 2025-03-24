const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');

var router = express.Router();
var bodyParser = require('body-parser');
var flash = require('express-flash');

var connection = require('../database');

// Administrador Aluno
router.get('/administrador_aluno', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		// Render login template
		connection.query('SELECT * FROM aluno ORDER BY nome', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/aluno/aluno', {
					// EJS variable and server-side variable
					data: "", message: ""
				});
				} else {
				response.render('administrador/aluno/aluno', {
					data: rows, message: ""
				});
			}
		});
		} else {
		// Not logged in
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/administrador_aluno_excluir', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		// Render login template
		var ra = request.query.ra;
		connection.query('DELETE FROM aluno WHERE ra = ?', [ra], function (err, rows) {
			if (err) {
			request.flash('error', err);
					connection.query('SELECT * FROM aluno ORDER BY nome', function (err, rows) {
					if (err) {
						request.flash('error', err);
						response.render('administrador/aluno/aluno', {
							// EJS variable and server-side variable
							data: "", message: "O aluno não pode ser excluído! Ele é muito importante!"
						});
						} else {
						response.render('administrador/aluno/aluno', {
							data: rows, message: "O aluno não pode ser excluído! Ele é muito importante!"
						});
					}
				});
				} else {
				
				connection.query('DELETE FROM login WHERE usuario = ?', [ra], function (err, rows) {
					if (err) {
						request.flash('error', err);
					} 
				});
				
				connection.query('SELECT * FROM aluno ORDER BY nome', function (err, rows) {
					if (err) {
						request.flash('error', err);
						response.render('administrador/aluno/aluno', {
							// EJS variable and server-side variable
							data: "", message: "O aluno não pode ser excluído! Ele é muito importante!"
						});
						} else {
						response.render('administrador/aluno/aluno', {
							data: rows, message: "Aluno excluído com sucesso!"
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

router.get('/administrador_aluno_cadastro', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		
		// Render login template
		connection.query('SELECT * FROM turma', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/aluno/cad_aluno', {
					// EJS variable and server-side variable
					data: "", message: ""
				});
				} else {
				response.render('administrador/aluno/cad_aluno', {
					data: rows, message: ""
					
				});
			}});
			
			} else {
			// Not logged in
			response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.post('/administrador_aluno_cadastrado', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		// Capture the input fields
		let ra = request.body.ra;
		let nome = request.body.nome;
		let cpf = request.body.cpf;
		let email = request.body.email;
		let nasc = request.body.nasc;
		let cod_turma = request.body.cod_turma;
		
		
		connection.query('SELECT aluno.ra, professor.rp FROM aluno right join professor on aluno.ra = professor.rp WHERE aluno.ra = ? OR professor.rp = ? LIMIT 1', [ra, ra], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				
				connection.query('SELECT * FROM turma', function (err, rows) {
					if (err) {
						request.flash('error', err);
						response.render('administrador/aluno/cad_aluno', {
							// EJS variable and server-side variable
							data: "", message: "Aluno não cadastrado! O RA já está cadastrado!"
						});
						} else {
						response.render('administrador/aluno/cad_aluno', {
							// EJS variable and server-side variable
							data: rows, message: "Aluno não cadastrado! O RA já está cadastrado!"
						});
					}});
					
					} else {
					connection.query('INSERT INTO aluno (ra, nome, cpf, email, nasc, cod_turma) values (?,?,?,?,?,?)', [ra, nome, cpf, email, nasc, cod_turma], function(error, results, fields) {
						// If there is an issue with the query, output the error
						if (error) throw error;
						// response.render('administrador/adm_aluno/reg_aluno', {message: "Aluno cadastrado com sucesso!"});
					});
					
					connection.query('INSERT INTO login (usuario, senha, tipo_usuario) values (?,?,"aluno")', [ra, nasc], function(error, results, fields) {
						// If there is an issue with the query, output the error
						if (error) throw error;
						// response.render('administrador/adm_aluno/reg_aluno', {message: "Aluno cadastrado com sucesso!"});
						
						connection.query('SELECT * FROM turma', function (err, rows) {
							if (err) {
								request.flash('error', err);
								response.render('administrador/aluno/cad_aluno', {
									// EJS variable and server-side variable
									data: "", message: ""
								});
								} else {
								response.render('administrador/aluno/cad_aluno', {
									// EJS variable and server-side variable
									data: rows, message: "Aluno cadastrado com sucesso!"
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

router.get('/administrador_aluno_editar', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		
		// Render login template
		var ra= request.query.ra;
		connection.query('SELECT * FROM aluno WHERE ra = ? limit 1', [ra], function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/aluno/editar_aluno', {
					// EJS variable and server-side variable
					data: "", message: "", datac: ""
				});
				} else {
				connection.query('SELECT * FROM turma', function (err, cows) {
					if (err) {
						request.flash('error', err);
						response.render('administrador/aluno/editar_aluno', {
							// EJS variable and server-side variable
							data: "", message: "", datac: ""
						});
						} else {
						response.render('administrador/aluno/editar_aluno', {
							data: rows, message: "", datac: cows
							
						});
					}});
					
					
			}});
			
			} else {
			// Not logged in
			response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.post('/administrador_aluno_editado', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		// Capture the input fields
		let ra = request.body.ra;
		let nome = request.body.nome;
		let cpf = request.body.cpf;
		let email = request.body.email;
		let nasc = request.body.nasc;
		let cod_turma = request.body.cod_turma;
		
		connection.query('UPDATE aluno SET nome = ?, email = ?, nasc = ?, cod_turma = ?, cpf = ? WHERE ra = ?', [nome, email, nasc, cod_turma, cpf, ra], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// response.render('administrador/adm_aluno/reg_aluno', {message: "Aluno cadastrado com sucesso!"});
		});
		
		connection.query('SELECT * FROM aluno ORDER BY nome', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/aluno/aluno', {
					// EJS variable and server-side variable
					data: "", message: ""
				});
				} else {
				response.render('administrador/aluno/aluno', {
					data: rows, message: "Aluno editado com sucesso!"
				});
			}
		});
		} else {
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

module.exports = router;