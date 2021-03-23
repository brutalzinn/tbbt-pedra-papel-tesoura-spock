var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('game', {});
});
router.get('/chat', function(req, res){
  // res.render('chat', {});
});
module.exports = router;
