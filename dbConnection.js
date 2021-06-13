var mysql = require('mysql');

module.exports = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'nizam123',
    database:'codequery'
})