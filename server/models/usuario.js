const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
	values:['ADMIN_ROLE', 'USER_ROLE'],
	message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema


let usuarioSchema = new Schema({
	nombre:{
		type: String,
		required: [true,'nombre es necesario']
	},
	email:{
		type: String,
		unique:true,//lo que me permite es no volver a repetir un email . De lo contrario sino lo hago me vuelve a repetirnr el mismo
		required: [true,'email es necesario']
	},
	password:{
		type: String,
		required: [true,'password es necesario']
	},
	img:{
		type: String,
		required: false
	},
	role:{
		type: String,
		default: 'USER_ROLE',
		enum: rolesValidos
	},
	estado:{
		type: Boolean,
		default:true
	},
	google:{
		type: Boolean,
		default: false
	}
})

usuarioSchema.methods.toJSON = function(){
	let user = this
	let userObject = user.toObject()
	delete userObject.password

	return userObject
}

usuarioSchema.plugin(uniqueValidator,{message: '{PATH} debe ser unico'})
module.exports =  mongoose.model('Usuario', usuarioSchema)
