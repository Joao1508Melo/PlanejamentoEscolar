const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');

var router = express.Router();
var bodyParser = require('body-parser');
var flash = require('express-flash');

var connection = require('../database');

// Administrador Horário

router.get('/administrador_horario', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		connection.query('SELECT * FROM horario ORDER BY cod_turma, dia_semana, hora', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/horario/horario', {
					data: "", message: ""
				});
				} else {
				response.render('administrador/horario/horario', {
					data: rows, message: ""
				});
			}
		});
		} else {
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/administrador_horario_excluir', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		var cod_turma = request.query.cod_turma;
		var cod_disciplina = request.query.cod_disciplina;
		connection.query('DELETE FROM horario WHERE cod_turma = ? AND cod_disciplina = ?', [cod_turma, cod_disciplina], function (err, rows) {
			if (err) {
				request.flash('error', err);
				connection.query('SELECT * FROM horario ORDER BY cod_turma, dia_semana, hora', function (err, rows) {
					response.render('administrador/horario/horario', {
						// EJS variable and server-side variable
						data: rows, message: "Não foi possível excluir o horário! O horário é muito importante!"
					});
				});
				} else {
				
				connection.query('SELECT * FROM horario ORDER BY cod_turma, dia_semana, hora', function (err, rows) {
					if (err) {
						request.flash('error', err);
						response.render('administrador/horario/horario', {
							// EJS variable and server-side variable
							data: rows, message: "Não foi possível excluir o horário! O horário é muito importante!"
						});
						} else {
						response.render('administrador/horario/horario', {
							data: rows, message: "Horário excluído com sucesso!"
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

router.get('/administrador_horario_cadastro', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		
		connection.query('SELECT * FROM turma', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/horario/cad_horario', {
					// EJS variable and server-side variable
					data: "", message: "", datab: ""
				});
				} else {
				
				connection.query('SELECT * FROM disciplina', function (err, rowsb) {
					if (err) {
						request.flash('error', err);
						response.render('administrador/horario/cad_horario', {
							// EJS variable and server-side variable
							data: "", message: "", datab: ""
						});
						} else {
						response.render('administrador/horario/cad_horario', {
							data: rows, message: "", datab: rowsb
						});
					}});
			}})
			
			} else {
			// Not logged in
			response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.post('/administrador_horario_cadastrado', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		// Capture the input fields
		let cod_turma = request.body.cod_turma;
		let cod_disciplina = request.body.cod_disciplina;
		let hora = request.body.hora;
		let dia_semana = request.body.dia_semana;
		
		connection.query('SELECT * FROM horario WHERE cod_turma = ? AND cod_disciplina = ? AND hora = ? AND dia_semana = ? LIMIT 1', [cod_turma, cod_disciplina, hora, dia_semana], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				
				connection.query('SELECT * FROM turma', function (err, rows) {
					if (err) {
						request.flash('error', err);
						response.render('administrador/horario/cad_horario', {
							// EJS variable and server-side variable
							data: "", message: "Horário não cadastrado! O horário já está cadastrado!", datab: ""
						});
						} else {
						
						connection.query('SELECT * FROM disciplina', function (err, rowsb) {
							if (err) {
								request.flash('error', err);
								response.render('administrador/horario/cad_horario', {
									// EJS variable and server-side variable
									data: "", message: "", datab: ""
								});
								} else {
								response.render('administrador/horario/cad_horario', {
									data: rows, message: "Horário não cadastrado! O horário já está cadastrado!", datab: rowsb
								});
							}});
					}})
					
					} else {
					connection.query('INSERT INTO horario (cod_turma, cod_disciplina, hora, dia_semana) values (?,?,?,?)', [cod_turma, cod_disciplina, hora, dia_semana], function(error, results, fields) {
						if (error) throw error;
						
						
						connection.query('SELECT * FROM turma', function (err, rows) {
							if (err) {
								request.flash('error', err);
								response.render('administrador/horario/cad_horario', {
									data: "", message: "", datab: ""
								});
								} else {
								
								connection.query('SELECT * FROM disciplina', function (err, rowsb) {
									if (err) {
										request.flash('error', err);
										response.render('administrador/horario/cad_horario', {
											data: "", message: "", datab: ""
										});
										} else {
										response.render('administrador/horario/cad_horario', {
											data: rows, message: "Horário cadastrado com sucesso!", datab: rowsb
										});
									}});
							}})
							
					});
			}			
		});
		} else {
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/administrador_horario_editar', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
		
		var cod_turma = request.query.cod_turma;
		var cod_disciplina = request.query.cod_disciplina;
		
		connection.query('SELECT * FROM horario WHERE cod_turma = ? AND cod_disciplina = ? LIMIT 1', [cod_turma, cod_disciplina], function (err, rowsc) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/horario/editar_horario', {
					// EJS variable and server-side variable
					data: "", message: "", datab: "", datac: ""
				});
				} else {
				connection.query('SELECT * FROM turma', function (err, rows) {
					if (err) {
						request.flash('error', err);
						response.render('administrador/horario/editar_horario', {
							// EJS variable and server-side variable
							data: "", message: "", datab: "", datac: ""
						});
						} else {
						
						connection.query('SELECT * FROM disciplina', function (err, rowsb) {
							if (err) {
								request.flash('error', err);
								response.render('administrador/horario/editar_horario', {
									// EJS variable and server-side variable
									data: "", message: "", datab: "", datac: rowsc
								});
								} else {
								response.render('administrador/horario/editar_horario', {
									data: rows, message: "", datab: rowsb, datac: rowsc
								});
							}
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

router.post('/administrador_horario_editado', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "admin")) {
	
		let cod_turma = request.body.cod_turma;
		let cod_disciplina = request.body.cod_disciplina;
		let hora = request.body.hora;
		let dia_semana = request.body.dia_semana;
		
		connection.query('UPDATE horario SET hora = ?, dia_semana = ? WHERE cod_turma = ? AND cod_disciplina = ?', [hora, dia_semana, cod_turma, cod_disciplina], function(error, results, fields) {
			if (error) throw error;
		});
		
		connection.query('SELECT * FROM horario ORDER BY cod_turma, dia_semana, hora', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('administrador/horario/horario', {
					data: "", message: ""
				});
				} else {
				response.render('administrador/horario/horario', {
					data: rows, message: "Horário editado com sucesso!"
				});
			}
		});
			} else {
			response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

module.exports = router;											