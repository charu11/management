var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var cors = require('cors');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var UserController = require('../controllers/userController');
var User = require('../models/user');

app.use(cors())
router.use(cors())

//support on x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
  }));
  
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
  
  router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  //user signup

  exports.signup = function(req, res){
      console.log('user adding');
      User.findOne({'email' : req.body.email})
      .exec(function(err, user){
          if(err){
              console.log('error occured', err);
          }else{
              if(user != null){
                  console.log('user is already exists');
              }else{
                  console.log('null data');

                  var user = new User()
                  user. name = req.body.name,
                  user. email = req.body.email,
                  user. password = req.body.password,
                  user.country = req.body.country,
                  user.telephone = req.body.telephone

                  user.save(function(err){
                      if(err){
                          console.log('error occured', err);
                      }else{
                          console.log('succeeded');
                          res.json({message: 'success', details: 'user added successfully'});
                      }
                  });

              }
          }

    });
  };
