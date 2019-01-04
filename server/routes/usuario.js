const express = require('express')
const bcrypt = require('bcryptjs')
const _ = require('underscore')
const Usuario = require('../models/usuario') //lleva mayuscula usuario por que recibe objetos 
const { verificaToken ,verificaAdmin_Role } = require('../middlewares/autenticacion')
const app = express()//enviarlo a server
 
app.get('/usuario', verificaToken ,function (req, res) {
/*
return res.json({
	usuario: req.usuario,
	nombre: req.usuario.nombre,
	email: req.usuario.email
})
*/
let desde = req.query.desde || 0
desde = Number(desde)

let limite = req.query.limite || 5
limite = Number(limite)

Usuario.find({estado:true}, 'nombre email role estado google img')
	.skip(desde)
	.limit(limite)
	.exec( (err,usuarios) =>{
		if(err){
			return res.status(400).json({
				ok: false,
				err
			})
		}

		Usuario.count({estado:true} ,(err,conteo) =>{

			res.json({
			ok:true,
			usuarios,
			cuantos: conteo
		})
		})


		
	})

})

app.post('/usuario',[verificaToken , verificaAdmin_Role],  function (req, res) {
  let body = req.body

let usuario = new Usuario({
	nombre: body.nombre,
	email: body.email,
	password: bcrypt.hashSync(body.password,10),
	role: body.role

})

//de esta manera lo guardo en la base de datos
usuario.save((err,usuariodb)=>{
	if(err){
		return res.status(400).json({
			ok:false,
			err
		})
	}

	res.json({
		ok:true,
		usuario: usuariodb
	})

})


})

app.put('/usuario/:id', [verificaToken , verificaAdmin_Role] ,function (req, res) {

let id = req.params.id
let body = _.pick(req.body , ['nombre' , 'email' , 'img' , 'role' , 'estado']) 

Usuario.findByIdAndUpdate(id,body, {new: true , runValidators: true},(err,usuariodb)=>{ //new lo que haces es poner en estado true cuando haya actualizado los datos del id



		if(err){
		return res.status(400).json({
			ok:false,
			err
		})
	}


	res.json({
		ok: true,
		usuario: usuariodb
	})



})


})
app.delete('/usuario/:id', [verificaToken , verificaAdmin_Role] ,function(req,res){
	let id = req.params.id

	let cambiarEstado = {
		estado:false
	}

	Usuario.findByIdAndUpdate(id,cambiarEstado,{new:true},(err,usuarioBorrado)=>{




		if(err){
		return res.status(400).json({
			ok:false,
			err
		})
	}
	if (!usuarioBorrado) {

		return res.status(400).json({
			ok:false,
			error:{
				message: 'usuario no encontrado'
			}
		}) 
	}
	res.json({
		ok: true,
		usuario: usuarioBorrado
	})

	})
})





module.exports = app