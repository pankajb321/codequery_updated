// modules import
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars')
var session = require('express-session')


// Router objects
var usersRouter = require('./routes/users');
var db = require('./dbConnection')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+"/views/layout",partialsDir:__dirname+'/views/partials'}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'1729',cookie:{maxAge:6000000000}}))

//route setting
app.use('/', usersRouter);

// Database connection
db.connect(async(err)=>{
  if(err){
    console.log(err);
  }else{
    console.log('Database connected');
    //
    db.query( `SHOW TABLES`,async(err,tables)=>{
      // console.log(tables);
      if(tables.length!=0){
        // console.log('tables exist');
      }else{
        const sqlUsersTable =  `CREATE TABLE users(user_id int(255) primary key auto_increment,username varchar(255),email varchar(255),password varchar(255))`;
        const sqlQuestionsTable =  `CREATE TABLE questions(qn_id int(255) primary key auto_increment,qn_text varchar(255),user_id varchar(255),category varchar(255),ans_count int(255))`;
        const sqlAnswersTable =  `CREATE TABLE answers(ans_id int(255) primary key auto_increment,ans_text varchar(255),qn_id varchar(255),user_id varchar(255))`;
        await db.query(sqlUsersTable);
        await db.query(sqlQuestionsTable);
        await db.query(sqlAnswersTable);
        // console.log('Process finished..Tables created');
      }
    });
    
  }
})




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
