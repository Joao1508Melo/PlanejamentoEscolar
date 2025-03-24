const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');

var router = express.Router();
var bodyParser = require('body-parser');
var flash = require('express-flash');

var connection = require('../database');

// Professor Notas

router.get('/professor_notas', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		connection.query('SELECT * FROM disciplina WHERE rp_professor = ? ORDER BY nome', [request.session.usuario], function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('professor/notas/notas', {
					data: "", message: ""
				});
				} else {
				response.render('professor/notas/notas', {
					data: rows, message: ""
				});
			}
		});
		} else {
		response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/professor_notas_acessar', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		var codigo = request.query.codigo;
		connection.query('SELECT * FROM nota WHERE cod_disciplina = ? ORDER BY cod_disciplina', [codigo], function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('professor/notas/notas_acessar', {
					data: null, message: "", disciplina: codigo
				});
				} else {
				
				connection.query('SELECT * FROM disciplina WHERE codigo = ? ORDER BY codigo', [codigo], function (err, rowsb) {
					if (err) {
						request.flash('error', err);
						response.render('professor/notas/notas_acessar', {
							data: null, message: "", disciplina: codigo
						});
						} else {
						
						
						connection.query('SELECT * FROM aluno', function (err, rowsc) {
							if (err) {
								request.flash('error', err);
								response.render('professor/notas/notas_acessar', {
									data: null, message: "", disciplina: codigo
								});
								} else {
								response.render('professor/notas/notas_acessar', {
									data: rows, message: "", disciplina: codigo, datab: rowsb, datac: rowsc
								});
							}
						});
					}});
					
			}});
			} else {
			response.render('index', {errormessage: "Faça login para acessar a página!"});
	}
});

router.get('/professor_notas_excluir', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		var cod_nota = request.query.cod_nota;
		var cod_disciplina = request.query.cod_disciplina;
		connection.query('DELETE FROM nota WHERE cod_nota = ?', [cod_nota], function (err, rowsd) {
			if (err) {
				
				request.flash('error', err);
				response.render('professor/notas/notas_acessar', {
					data: "", message: "", disciplina: cod_disciplina
				});
				} else {
				
				connection.query('SELECT * FROM nota WHERE cod_disciplina = ? ORDER BY cod_disciplina', [cod_disciplina], function (err, rows) {
					if (err) {
						request.flash('error', err);
						response.render('professor/notas/notas_acessar', {
							// EJS variable and server-side variable
							data: rows, message: "Não foi possível excluir a nota!", disciplina: cod_disciplina
						});
						} else {
						
						connection.query('SELECT * FROM disciplina WHERE codigo = ? ORDER BY codigo', [cod_disciplina], function (err, rowsb) {
							if (err) {
								request.flash('error', err);
								response.render('professor/notas/notas_acessar', {
									data: "", message: "", disciplina: cod_disciplina
								});
								} else {
								
								
								connection.query('SELECT * FROM aluno', function (err, rowsc) {
									if (err) {
										request.flash('error', err);
										response.render('professor/notas/notas_acessar', {
											data: "", message: "", disciplina: cod_disciplina
										});
										} else {
										response.render('professor/notas/notas_acessar', {
											data: rows, message: "Nota excluída com sucesso!", disciplina: cod_disciplina, datab: rowsb, datac: rowsc
										}
										);
									}
								}
								);
							}
						}
						);
					}
				}
				);
			}
		}
	)
	} else {
	// Not logged in
	response.render('index', {errormessage: "Faça login para acessar a página!"});
}});

router.get('/professor_notas_cadastro', function(request, response) {
	if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
		var cod_disciplina = request.query.cod_disciplina;
		connection.query('SELECT * FROM aluno', function (err, rows) {
			if (err) {
				request.flash('error', err);
				response.render('professor/notas/cad_notas', {
					// EJS variable and server-side variable
					data: "", message: "", datab: ""
				});
				} else {
				
				connection.query('SELECT * FROM disciplina WHERE rp_professor = ?', [request.session.usuario], function (err, rowsb) {
					if (err) {
						request.flash('error', err);
						response.render('professor/notas/cad_notas', {
							// EJS variable and server-side variable
							data: "", message: "", datab: ""
						});
						} else {
						response.render('professor/notas/cad_notas', {
							data: rows, message: "", datab: rowsb
						});
					}});
				}})
				} else {
				// Not logged in
				response.render('index', {errormessage: "Faça login para acessar a página!"});
		}
	});
	
	router.post('/professor_notas_cadastrado', function(request, response) {
		if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
			// Capture the input fields
			let cod_disciplina = request.body.cod_disciplina;
			let ra_aluno = request.body.ra_aluno;
			let p1 = request.body.p1;
			let p2 = request.body.p2;
			let t = request.body.t;
			let media = request.body.media;
			
			connection.query('SELECT * FROM nota WHERE ra_aluno = ? AND cod_disciplina = ? LIMIT 1', [ra_aluno, cod_disciplina], function(error, results, fields) {
				// If there is an issue with the query, output the error
				if (error) throw error;
				// If the account exists
				if (results.length > 0) {
					
					connection.query('SELECT * FROM aluno', function (err, rows) {
						if (err) {
							request.flash('error', err);
							response.render('professor/notas/cad_notas', {
								// EJS variable and server-side variable
								data: "", message: "Nota não cadastrada! O aluno já tem uma nota cadastrada nesta disciplina!", datab: ""
							});
							} else {
							
							connection.query('SELECT * FROM disciplina WHERE rp_professor = ?', [request.session.usuario], function (err, rowsb) {
								if (err) {
									request.flash('error', err);
									response.render('professor/notas/cad_notas', {
										// EJS variable and server-side variable
										data: "", message: "", datab: ""
									});
									} else {
									response.render('professor/notas/cad_notas', {
										data: rows, message: "Nota não cadastrada! O aluno já tem uma nota cadastrada nesta disciplina!", datab: rowsb
									});
								}});
						}})
						
						} else {
						connection.query('INSERT INTO nota (ra_aluno, cod_disciplina, p1, p2, t, media) values (?,?,?,?,?,?)', [ra_aluno, cod_disciplina, p1, p2, t, media], function(error, results, fields) {
							if (error) throw error;
							
							
							connection.query('SELECT * FROM aluno', function (err, rows) {
								if (err) {
									request.flash('error', err);
									response.render('professor/notas/cad_notas', {
										data: "", message: "", datab: ""
									});
									} else {
									
									connection.query('SELECT * FROM disciplina WHERE rp_professor = ?', [request.session.usuario], function (err, rowsb) {
										if (err) {
											request.flash('error', err);
											response.render('professor/notas/cad_notas', {
												data: "", message: "", datab: ""
											});
											} else {
											response.render('professor/notas/cad_notas', {
												data: rows, message: "Nota cadastrada com sucesso!", datab: rowsb
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
	
	router.get('/professor_notas_editar', function(request, response) {
		if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
			
			var cod_nota = request.query.cod_nota;
			
			connection.query('SELECT * FROM nota WHERE cod_nota = ? LIMIT 1', [cod_nota], function (err, rowsc) {
				if (err) {
					request.flash('error', err);
					response.render('professor/notas/editar_notas', {
						// EJS variable and server-side variable
						data: "", message: "", datab: "", datac: ""
					});
					} else {
					connection.query('SELECT * FROM aluno', function (err, rows) {
						if (err) {
							request.flash('error', err);
							response.render('professor/notas/editar_notas', {
								// EJS variable and server-side variable
								data: "", message: "", datab: "", datac: ""
							});
							} else {
							
							connection.query('SELECT * FROM disciplina WHERE rp_professor = ?', [request.session.usuario], function (err, rowsb) {
								if (err) {
									request.flash('error', err);
									response.render('professor/notas/editar_notas', {
										// EJS variable and server-side variable
										data: "", message: "", datab: "", datac: rowsc
									});
									} else {
									response.render('professor/notas/editar_notas', {
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
	
	router.post('/professor_notas_editado', function(request, response) {
		if ((request.session.loggedin) && (request.session.tipo_usuario === "professor")) {
			let cod_nota = request.body.cod_nota;
			let cod_disciplina = request.body.cod_disciplina;
			let ra_aluno = request.body.ra_aluno;
			let p1 = request.body.p1;
			let p2 = request.body.p2;
			let t = request.body.t;
			let media = request.body.media;
			
			connection.query('UPDATE nota SET p1 = ?, p2 = ?, t = ?, media = ? WHERE cod_nota = ?', [p1, p2, t, media, cod_nota], function(error, results, fields) {
				if (error) throw error;
			});
			
			connection.query('SELECT * FROM turma', function (err, rows) {
				if (err) {
					request.flash('error', err);
					response.render('professor/notas/editar_notas', {
						// EJS variable and server-side variable
						data: "", message: "", datab: ""
					});
					} else {
					
					connection.query('SELECT * FROM disciplina WHERE rp_professor = ?', [request.session.usuario], function (err, rowsb) {
						if (err) {
							request.flash('error', err);
							response.render('professor/notas/notas', {
								// EJS variable and server-side variable
								data: "", message: "", datab: ""
							});
							} else {
							response.render('professor/notas/notas', {
								data: rowsb, message: "Nota editada com sucesso!", datab: rows
							});
						}});
				}});
				} else {
				response.render('index', {errormessage: "Faça login para acessar a página!"});
		}
	});
	
	module.exports = router;															