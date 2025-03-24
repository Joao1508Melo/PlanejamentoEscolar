const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');

var router = express.Router();
var bodyParser = require('body-parser');
var flash = require('express-flash');

const app = express();

var connection = require('./database')

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static('.'));
app.use(express.static('public'));

var nome = "";

app.use(function (req, res, next) {
	res.locals.foto = req.session.foto;
	res.locals.usuario = req.session.usuario;
	res.locals.nome = nome;
	next();
});

// var userRoute = require(__dirname + '/public/html/aluno/');
// app.use('/notas', userRoute);

app.set('view engine', 'ejs')

app.get('/', function(request, response) {
	// Render login template
	response.render(path.join(__dirname + '/views/index'), {errormessage: ""});
});

app.get('/solucao', function(request, response) {
	// Render login template
	response.render(path.join(__dirname + '/views/solucao'), {errormessage: ""});
});

app.post('/auth', function(request, response) {
	// Capture the input fields
	let usuario = request.body.usuario;
	let senha = request.body.senha;

	// Ensure the input fields exists and are not empty
	if (usuario && senha) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM login WHERE usuario = ? AND senha = ? limit 1', [usuario, senha], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.usuario = usuario;
				request.session.tipo_usuario = results[0].tipo_usuario;
				if (request.session.tipo_usuario === "professor") {
					connection.query('SELECT * FROM professor WHERE rp = ? limit 1', [request.session.usuario], function (err, result) {
						if (err) {
							request.flash('error', err);
						}
						nome = result[0].nome;
						request.session.nome = nome;
						// console.log(nome);
					});
				} else if (request.session.tipo_usuario === "aluno") {
					connection.query('SELECT * FROM aluno WHERE ra = ? limit 1', [request.session.usuario], function (err, result) {
						if (err) {
							request.flash('error', err);
						}
						nome = result[0].nome;
						request.session.nome = nome;
					});
				}
				request.session.foto = results[0].foto;
				request.session.cod_turma = "";
				
				// Redirect to home page
				response.redirect('/home');
				} else {
				// response.send('Incorrect User and/or Password!');
				response.render(path.join(__dirname + '/views/index'), {errormessage: "Usuário e/ou senha incorretos!"});
			}			
			response.end();
		});
		} else {
		response.send('Please enter User and Password!');
		response.end();
	}
});

app.get('/logout', function(request, response) {
	request.session.loggedin = false;
	request.session.usuario = null;
	request.session.nome = null;
	response.render(path.join(__dirname + '/views/index'), {errormessage: "Logout efetuado com sucesso!"});
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		if (request.session.tipo_usuario === "admin") {
			response.redirect('/administrador');
			} else if (request.session.tipo_usuario === "professor") {
			response.redirect('/professor');
			} else if (request.session.tipo_usuario === "aluno") {
			response.redirect('/aluno');
		}
		} else {
		response.render(path.join(__dirname + '/views/index'), {errormessage: "Faça login para acessar a página!"});
	}
});

module.exports = app;

var aluna = require("./model/aluno");
app.use(aluna);

var professora = require("./model/professor");
app.use(professora);

var professoranotas = require("./model/professor_notas");
app.use(professoranotas);

var professorafrequencia = require("./model/professor_frequencia");
app.use(professorafrequencia);

var administradora = require("./model/admin");
app.use(administradora);

var administradoraaluno = require("./model/admin_aluno");
app.use(administradoraaluno);

var administradoradisciplina = require("./model/admin_disciplina");
app.use(administradoradisciplina);

var administradoraprofessor = require("./model/admin_professor");
app.use(administradoraprofessor);

var administradorahorario = require("./model/admin_horario");
app.use(administradorahorario);

var administradoraturma = require("./model/admin_turma");
app.use(administradoraturma);

// Extra

module.exports = router

app.listen(3000, () => {
	console.log("Servidor online.");
});	