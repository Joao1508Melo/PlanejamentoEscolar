const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', //
  password: 'Gad231525', //
  database: 'pge',
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Conectado ao banco de dados!');
});

module.exports = connection;