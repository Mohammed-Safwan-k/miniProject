var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./config/connection')
const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const session = require('express-session')

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Enabling express-session :)
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret:'secret-key',
  saveUninitialized:true,
  cookie:{maxAge: oneDay},
  resave:false}))

//CACHE CONTROL
app.use((req,res,next)=>{
  res.set("cache-control","no-store");
  next();
})

db.connect((err)=>{
  // console.log("Function working");
  if(err)
  console.log('CONNECTION ERROR'+err); 
  else 
  console.log('CONNECTED DATABASE TO PORT 27017');})

app.use('/', usersRouter);
app.use('/admin', adminRouter);

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
