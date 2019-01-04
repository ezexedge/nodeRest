const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario') //lleva mayuscula usuario por que recibe objetos 

const app = express()//enviarlo a server




app.post('/login' , (req,res)=>{


	let body = req.body
	Usuario.findOne({email:body.email},(err,usuarioDB)=>{


		if(err){
		return res.status(500).json({
			ok:false,
			err
		})
	}


		if(!usuarioDB){
		return res.status(400).json({
			ok:false,
			err:{
				message:'(usuario) o contraseña incorrecta'
			}
		})
	}

	if (!bcrypt.compareSync(body.password , usuarioDB.password)){

		return res.status(400).json({
			ok:false,
			err:{
				message:'usuario o (contraseña) incorrecta'
			}
		})

	}

	let token = jwt.sign({
  		usuario: usuarioDB

		}, process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN })
 


	res.json({
		ok:true,
		usuario: usuarioDB,
		token
	})

	})
})
module.exports = app