var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); //To Parse Json/String/buffer data=
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var credential = require('./model/index');
var passportJWT = require("passport-jwt");
var ExtractJWT = passportJWT.ExtractJwt;
var JWTStrategy   = passportJWT.Strategy;

var userRouter = require('./routes/users');
var salaryRouter = require('./routes/salary');
var credentialRouter = require('./routes/auth-session');
var tokenRouer = require('./routes/token');


var app = express();



//connect to database
mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true});
//database connection error handler
let db = mongoose.connection;
//bind connection object  to error object to get notificaton of connection error
db.on('error', console.log.bind(console, 'Mongodb connection error!'));


 mongoose.set('useCreateIndex', true),
 

// view engine setup
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

//app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(expressValidator());

// app.use(require("express-session")({
//   secret:"Miss white is my cat",
//   resave: false,
//   saveUninitialized: false
// }));


app.use(passport.initialize());//intialize passport
app.use(passport.session());//persistant session

//passport configuration
passport.use(new LocalStrategy(credential.authenticate()));
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey   : 'abs is awesome'
},
function (jwtPayload, cb) {

  //find the user in db if needed
  return credential.findById(jwtPayload._id)
      .then(user => {
          return cb(null, user);
      })
      .catch(err => {
          return cb(err);
      });
}
));
//session manage
passport.serializeUser(credential.serializeUser());
passport.deserializeUser(credential.deserializeUser());


app.use('/user', passport.authenticate('jwt', {session: false}),userRouter);
app.use('/user/:id/salary', salaryRouter);
//app.use('/', credentialRouter);
app.use('/', tokenRouer);



app.listen(3000, function(){
  console.log("server is in listening mode!!!");
})
