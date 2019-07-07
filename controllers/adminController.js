var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var cors = require('cors');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var AdminController = require('../controllers/adminController');
var Admin = require('../models/admin');

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


  // admin signup

  exports.signup = function(req, res){
      console.log('admin registering');
      Admin.findOne({'email' : req.body.email})
      .exec(function(err, admins){
          if(err){
              console.log('error occured', err);
          }else{
              if(admins != null){
                  console.log('email is already registered');
                  res.json({message: 'failed', details: 'email is already registered'});

              }else{
                  console.log('null data, email not been registered')

                  var admin = new Admin();
                  admin.name = req.body.name,
                  admin.email = req.body.email,
                  admin.password = req.body.password

                  admin.save(function(err){
                      if(err){
                          console.log('error occured', err);
                          res.json({messsage: 'failed', details: 'admin saved failed'});

                      }else{
                          admin.password = undefined;
                          console.log('admin added');
                          res.json({message: 'success', details: 'admin added successfully'});
                      }
                  });
              }
          }
      });
  };


  //admin login

  exports.signin = function(req, res){
      Admin.findOne({'email': req.body.email})
      .exec(function(err, admin){
          if(err){
              console.log('error occured', err);
          }else{
              if(admin != null){
                  console.log('not a null data so admin already exists');
                  if(bcrypt.compareSync(req.body.password, admin.password)){
                    admin.password = undefined;
                    res.json({ message: 'success', details: "Login successfully", content: admin, token: jwt.sign({ name: admin.name ,email: admin.email,  _id: admin._id}, 'RESTFULAPIs') });
                  }else{
                      res.json({message: 'failed ', details: 'login has failed'});
                      console.log('login has failed');
                  }
               
            }else{
                console.log('null data, user doesnt exist');
            }

          }
      });
  }