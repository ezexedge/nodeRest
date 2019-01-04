const express = require('express')
const app = express()//enviarlo a server
 app.use(require('./usuario')) 

 app.use(require('./login'))

 module.exports = app 
