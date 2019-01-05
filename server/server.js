
require('./config/config')
const express = require('express')
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json

app.use(bodyParser.json())

//habilitar carpeta public


app.use(express.static(path.resolve(__dirname ,  '../public')))

//va hacia todas las rutas
 app.use(require('./routes/index'))  



  mongoose.connect(process.env.URLDB,{useCreateIndex:true,useNewUrlParser:true}, (err,res)=>{

  	if(err)throw err

  	console.log('base de datos online')

  })
 
app.listen(process.env.PORT,()=>{
	console.log('escuchando Puerto', process.env.PORT)
})