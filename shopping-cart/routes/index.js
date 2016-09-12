var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var product = require('../models/productSSD');
var Order = require('../models/order');


/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
product.find(function(err,docs){
  var productChunks = [];
  var chunkSize = 3;
    for (var i = 0; i < docs.length; i+=chunkSize) {
      productChunks.push(docs.slice(i,chunkSize+i));

    }

  res.render('shop/index', { title: 'Dandan shopping cart',products: productChunks ,successMsg:successMsg,noMessage:!successMsg});
  });
});

router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {} );

  product.findById(productId,function(err, product){
      if(err){
        return res.redirect('/');

      }
      cart.add(product, product.id);
      req.session.cart = cart;
      //console.log(req.session.cart);

      res.redirect('/');
  });
});

router.get('/reduce/:id',function(req,res,next){
      var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {} );
  cart.reduceByOnde(productId);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
});

router.get('/removeall/:id',function(req,res,next){
      var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {} );
  cart.removeall(productId);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function (req, res, next) {
  if(!req.session.cart){
    return res.render('shop/shopping-cart', {products:null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generatrArray(), totalPrice: cart.totalPrice});

});

router.get('/checkout',isLoggedIn,function(req, res, next){
   if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }

  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];

  res.render('shop/checkout', {total: cart.totalPrice,errMsg:errMsg,noError:!errMsg});

});

router.post('/checkout',isLoggedIn,function(req, res, next){

 if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  //cirde card stripe API
    var stripe = require("stripe")(
    "sk_test_Svt15snS7ssCK0ni28x8N5eA"
  );

  stripe.charges.create({
    amount: cart.totalPrice*100,
    currency: "eur",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge"
  }, function(err, charge) {

    if(err){
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }


    var order = new Order({
      user: req.user,
      cart: cart,
      address:req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result){
      req.flash('success','Successfully bought product!');
      req.session.cart = null;
      res.redirect('/');
    });
  });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}

module.exports = router;
