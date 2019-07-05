var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var app = express();
var cors = require('cors');


//routers
//var index = require('./routes/index');
var user = require('./routes/user');
var admin = require('./routes/admin');
var date = require('./routes/date');




//Models
var User = require('./models/user');
var Admin = require('./models/admin');
var Date = require('./models/date')


var jsonwebtoken = require('jsonwebtoken');

app.use(cors());var http = require('http');
app.use(express.static('/public'));
app.use('/public', express.static('/public'));


var portSelected = 8500;
var dbe = 'mongodb://localhost/management';
 app.listen(portSelected, function() {
  console.log('Nexgen Nexzent-core API App listening on port ' + portSelected);

});



mongoose.connect(dbe);
// mongoose.connect(uri);
mongoose.connection.once('open', function(){
  console.log('connection has made');
}).on('error', function(error){
  console.log('connection error', error);
})


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// view engine setup
//app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(morgan('Nexzent-core-log'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//Token middleware
app.use(function(req, res, next){
  if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'nexrefx_api'){
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode){
      if(err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});


/* Routes */
//app.use('/', index);
app.use('/user', user);
app.use('/admin', admin);
app.use('/date', date);


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
next(err);
});

//enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
 // res.render('error');
});

module.exports = app;