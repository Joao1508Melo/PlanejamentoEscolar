const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');

var router = express.Router();
var bodyParser = require('body-parser');
var flash = require('express-flash');

var connection = require('../database');

// Professor Frequência

router.get('/professor_frequencia', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		connection.query('SELECT * FROM disciplina WHERE rp_professor = ? ORDER BY nome', [request.session.usuario], function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('professor/frequencia/frequencia', {
					data: "", message: ""
				});
				} else {
				response.render('professor/frequencia/frequencia', {
					data: rows, message: ""
				});
			}
		});
		} else {
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/professor_frequencia_acessar', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		var codigo = request.query.codigo;
		connection.query('SELECT * FROM frequencia WHERE cod_disciplina = ? ORDER BY cod_disciplina, data_frequencia', [codigo], function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('professor/frequencia/frequencia_acessar', {
					data: "", message: "", disciplina: codigo
				});
				} else {
				
				connection.query('SELECT * FROM disciplina WHERE codigo = ? ORDER BY codigo', [codigo], function (err, rowsb) {
					if (err) {
						request.flash('error', err);
						response.render('professor/frequencia/frequencia_acessar', {
							data: "", message: "", disciplina: codigo
						});
						} else {
						response.render('professor/frequencia/frequencia_acessar', {
							data: rows, message: "", disciplina: codigo, datab: rowsb 
						});
					}
				});
			}
		});
		} else {
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/professor_frequencia_excluir', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		var cod_frequencia = request.query.cod_frequencia;
		var cod_disciplina = request.query.cod_disciplina;
		connection.query('DELETE FROM frequencia WHERE cod_frequencia = ?', [cod_frequencia], function (err, rows) {
			if (err) {
				request.flash('error', err);
				connection.query('SELECT * FROM frequencia WHERE cod_disciplina = ? ORDER BY cod_disciplina, data_frequencia', [cod_disciplina], function (err, rows) {
					response.render('professor/frequencia/frequencia_acessar', {
						// EJS variable and server-side variable
						data: rows, message: "Não foi possível excluir a frequência!", disciplina: cod_disciplina
					});
				});
				} else {
				
				connection.query('SELECT * FROM disciplina WHERE codigo = ? ORDER BY codigo', [cod_disciplina], function (err, rowsb) {
					if (err) {
						request.flash('error', err);
						response.render('professor/frequencia/frequencia_acessar', {
							data: "", message: "", disciplina: cod_disciplina
						});
						} else {
						connection.query('SELECT * FROM frequencia WHERE cod_disciplina = ? ORDER BY cod_disciplina', [cod_disciplina], function (err, rows) {
							if (err) {
								request.flash('error', err);
								response.render('professor/frequencia/frequencia_acessar', {
									// EJS variable and server-side variable
									data: rows, message: "Não foi possível excluir a frequência!", disciplina: cod_disciplina
								});
								} else {
								response.render('professor/frequencia/frequencia_acessar', {
									data: rows, message: "Frequência excluída com sucesso!", disciplina: cod_disciplina, datab: rowsb
								});
							}
						});
					}});
			}
		});
		} else {
		// Not logged in
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/professor_frequencia_cadastro', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		var cod_disciplina = request.query.cod_disciplina;
		connection.query('SELECT * FROM aluno', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('professor/frequencia/cad_frequencia', {
					// EJS variable and server-side variable
					data: "", message: "", datab: ""
				});
				} else {
				
				connection.query('SELECT * FROM disciplina WHERE rp_professor = ?', [request.session.usuario], function (err, rowsb) {
					if (err) {
						request.flash('error', err);
						response.render('professor/frequencia/cad_frequencia', {
							// EJS variable and server-side variable
							data: "", message: "", datab: ""
						});
						} else {
						response.render('professor/frequencia/cad_frequencia', {
							data: rows, message: "", datab: rowsb
						});
					}});
		}})
		} else {
		// Not logged in
		response.render('index', {errormessage: "Faça login para acessar a página!"});
}
});

router.post('/professor_frequencia_cadastrado', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		// Capture the input fields
		let cod_disciplina = request.body.cod_disciplina;
		let ra_aluno = request.body.ra_aluno;
		let data_frequencia = request.body.data_frequencia;
		let presenca;
		if (request.body.presenca) {
			presenca = 1;
			} else {
			presenca = 0;
		}
		
		connection.query('SELECT * FROM frequencia WHERE ra_aluno = ? AND cod_disciplina = ? and data_frequencia = ? LIMIT 1', [ra_aluno, cod_disciplina, data_frequencia], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				
				connection.query('SELECT * FROM aluno', function (err, rows) {
					if (err) {
						request.flash('error', err);
						response.render('professor/frequencia/cad_frequencia', {
							// EJS variable and server-side variable
							data: "", message: "Frequência não cadastrada! O aluno já tem uma presença cadastrada nesta disciplina nesta data!", datab: ""
						});
						} else {
						
						connection.query('SELECT * FROM disciplina WHERE rp_professor = ?', [request.session.usuario], function (err, rowsb) {
							if (err) {
								request.flash('error', err);
								response.render('professor/frequencia/cad_frequencia', {
									// EJS variable and server-side variable
									data: "", message: "", datab: ""
								});
								} else {
								response.render('professor/frequencia/cad_frequencia', {
									data: rows, message: "Frequência não cadastrada! O aluno já tem uma presença cadastrada nesta disciplina nesta data!", datab: rowsb
								});
							}});
					}})
					
					} else {
					connection.query('INSERT INTO frequencia (ra_aluno, cod_disciplina, data_frequencia, presenca) values (?,?,?,?)', [ra_aluno, cod_disciplina, data_frequencia, presenca], function(error, results, fields) {
						if (error) throw error;
						
						
						connection.query('SELECT * FROM aluno', function (err, rows) {
							if (err) {
								request.flash('error', err);
								response.render('professor/frequencia/cad_frequencia', {
									data: "", message: "", datab: ""
								});
								} else {
								
								connection.query('SELECT * FROM disciplina WHERE rp_professor = ?', [request.session.usuario], function (err, rowsb) {
									if (err) {
										request.flash('error', err);
										response.render('professor/frequencia/cad_frequencia', {
											data: "", message: "", datab: ""
										});
										} else {
										response.render('professor/frequencia/cad_frequencia', {
											data: rows, message: "Frequência cadastrada com sucesso!", datab: rowsb
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

router.get('/professor_frequencia_editar', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		
		var cod_frequencia = request.query.cod_frequencia;
		
		connection.query('SELECT * FROM frequencia WHERE cod_frequencia = ? LIMIT 1', [cod_frequencia], function (err, rowsc) {
			if (err) {
				request.flash('error', err);
				response.render('professor/frequencia/editar_frequencia', {
					// EJS variable and server-side variable
					data: "", message: "", datab: "", datac: ""
				});
				} else {
				connection.query('SELECT * FROM aluno', function (err, rows) {
					if (err) {
						request.flash('error', err);
						response.render('professor/frequencia/editar_frequencia', {
							// EJS variable and server-side variable
							data: "", message: "", datab: "", datac: ""
						});
						} else {
						
						connection.query('SELECT * FROM disciplina WHERE rp_professor = ?', [request.session.usuario], function (err, rowsb) {
							if (err) {
								request.flash('error', err);
								response.render('professor/frequencia/editar_frequencia', {
									// EJS variable and server-side variable
									data: "", message: "", datab: "", datac: rowsc
								});
								} else {
								response.render('professor/frequencia/editar_frequencia', {
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

router.post('/professor_frequencia_editado', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		let cod_frequencia = request.body.cod_frequencia;
		let cod_disciplina = request.body.cod_disciplina;
		let ra_aluno = request.body.ra_aluno;
		let data_frequencia = request.body.data_frequencia;
		
		let presenca;
		if (request.body.presenca) {
			presenca = 1;
			} else {
			presenca = 0;
		}
		
		connection.query('UPDATE frequencia SET data_frequencia = ?, presenca = ? WHERE cod_frequencia = ?', [data_frequencia, presenca, cod_frequencia], function(error, results, fields) {
			if (error) throw error;
		});
		
		connection.query('SELECT * FROM turma', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('professor/frequencia/editar_frequencia', {
					// EJS variable and server-side variable
					data: "", message: "", datab: ""
				});
				} else {
				
				connection.query('SELECT * FROM disciplina WHERE rp_professor = ?', [request.session.usuario], function (err, rowsb) {
					if (err) {
						request.flash('error', err);
						response.render('professor/frequencia/frequencia', {
							// EJS variable and server-side variable
							data: "", message: "", datab: ""
						});
						} else {
						response.render('professor/frequencia/frequencia', {
							data: rowsb, message: "Frequência editada com sucesso!", datab: rows
						});
					}});
			}});
			} else {
			response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
	});
	
	module.exports = router;												