var express = require('express');
var router = express.Router();
var admin = require('./users.js');

const port = process.env.PORT || 3000;

var app = express();
app.use('/', admin);


app.listen(port, () => {
  console.log("running.....")
})



module.exports = router;
