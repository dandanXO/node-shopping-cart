var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport');
var product = require('../models/productSSD');

var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csurf();
router.use(csrfProtection);

router.get('/profile',isLoggedIn, function(req, res, next){
  Order.find({user: req.user},function(err, orders){
    if(err){
      return res.write('ERROR');

    }
    //console.log(orders.cart);
    var cart;
    orders.forEach(function(order){
      cart = new Cart(order.cart);
      order.items = cart.generatrArray();
     
    });
    res.render('user/profile',{orders:orders});
    //console.log(orders);
  });
});

router.get('/logout',isLoggedIn,function (req, res, next) {
   req.logout();
   res.redirect('/');

});

router.use('/',notLoggedIn,function(req, res, next){
next();
});

router.get('/signup', function(req,res,next){
  var message =req.flash('error');
  res.render('user/signup',{csrfToken: req.csrfToken(), message: message, haserrors: message.length > 0});
  });

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}),function (req,res,next) { 
  if(req.session.oldUrl)
  {
    var  oldurl =req.session.oldUrl;
      req.session.oldUrl = null;
    res.redirect(oldurl);
  }else{
    res.redirect('/user/profile');
  }
 });


router.get('/signin', function(req, res, next){
  var message =req.flash('error');
  res.render('user/signin',{csrfToken: req.csrfToken(), message: message, haserrors: message.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
  
  failureRedirect: '/user/signin',
  failureFlash: true
}),function (req,res,next) { 
  if(req.session.oldUrl)
  {
   var  oldurl =req.session.oldUrl;
      req.session.oldUrl = null;
    res.redirect(oldurl);
  }else{
    res.redirect('/user/profile');
  }
 });




module.exports = router;



function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}