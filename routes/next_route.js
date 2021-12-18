const express = require("express")
const app = express();
const path = require("path")
// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public', 'images/koala.jpg'));
});
app.get('/user', function (req, res, next) {
    // if the user ID is 0, skip to the next route
    if (req.params.id === '0') next('route')
    // otherwise pass the control to the next middleware function in this stack
    else next()
  }, function (req, res, next) {
    // send a regular response
    res.sendFile('images/koala.jpg')
  })
  
  // handler for the /user/:id path, which sends a special response
  app.get('/user/:id', function (req, res, next) {
    res.send('special')
  })

  app.listen(3000,()=>{
    console.log("runing .. . . .")
  })