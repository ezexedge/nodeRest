const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload());


app.put( '/upload/:tipo/:id', function(req,res){
	let tipo = req.params.tipo
	let id = req.params.id

	if(!req.files){
		return res.status(400).json({
			ok:false,
			err:{
				message:'no se selecciono ningun archivo'

			}
		})
	}

	let tiposValidos = ['producto' , 'usuario']
if(tiposValidos.indexOf(tipo) < 0){


		return res.status(400).json({
			ok:false,
			err:{
				message: 'la tipos permitidos son' + tiposValidos.join(', '),
			}
		})

}

	let archivo = req.files.archivo
	let nombreCortado = archivo.name.split('.')
	let extension = nombreCortado[nombreCortado.length - 1 ]


	let extensionesValidas = ['jpg' ,  'png'  , 'gif' , 'jpeg']

	if(extensionesValidas.indexOf(extension) < 0){
		return res.status(400).json({
			ok:false,
			err:{
				message: 'la extensiones permitidas son' + extensionesValidas.join(', '),
				ext: extension
			}
		})
	}
	 

	 let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

	  archivo.mv( `uploads/${tipo}/${nombreArchivo}`, function(err) {
    if (err){ 
      return res.status(500).json({
      	ok:false,
      	err
      })
}
	
	if(tipo === 'usuario'){
		    imagenUsuario(id,res,nombreArchivo)

	}
	else{
		
    imagenProducto(id,res,nombreArchivo)
}
  });

})

function imagenUsuario(id,res, nombreArchivo){

	Usuario.findById(id,(err,usuarioDB)=>{

		    if (err){ 
      return res.status(500).json({
      	ok:false,
      	err
      })
}

if(!usuarioDB){
	return res.status(400).json({
		ok:false,
		err:{
			message:'el usuario no existe '
		}
	})
}



borrarArchivo(usuarioDB.img,'usuario')


usuarioDB.img = nombreArchivo

usuarioDB.save( (err,usuarioGuardado)=>{
	res.json({
		ok:true,
		usuario: usuarioGuardado,
		img: nombreArchivo
	})
})

	})

}
function imagenProducto(id,res,nombreArchivo){




	Producto.findById(id,(err,productoDB)=>{

		    if (err){ 
      return res.status(500).json({
      	ok:false,
      	err
      })
}

if(!productoDB){
	return res.status(400).json({
		ok:false,
		err:{
			message:'el producto no existe '
		}
	})
}



borrarArchivo(productoDB.img,'producto')


productoDB.img = nombreArchivo

productoDB.save( (err,productoGuardado)=>{
	res.json({
		ok:true,
		producto: productoGuardado,
		img: nombreArchivo
	})
})

	})


}


function borrarArchivo(nombreImagen,tipo){
	let  pathImagen =  path.resolve(__dirname , `../../uploads/${tipo}/${nombreImagen}`)
	if(fs.existsSync(pathImagen)){
		fs.unlinkSync(pathImagen)	
	}
}



module.exports = app