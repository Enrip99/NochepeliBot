const config = require('../data/config.json');
var lista = require('../data/lista.json');
const fs = require('fs');

/*
objeto:
	nombre
	enlace
	propuesto (la persona que lo propone)
	interesados[]
	no_interesados[]
*/

module.exports = {
	name: 'add',
	description: 'añade película a la lista',
	execute(message, args, client) {
		if (!args.length) {
			message.channel.send("Escribe \"add *nombre de la peícula*\" para añadirla a la lista.")
		}
		else {
			let inputpeli = message.content.substring(4,message.content.length).trim()
			let existe = false
			for (let i = 0; i < lista.lista.length; ++i){
				if (inputpeli.toLowerCase() === lista.lista[i].nombre.toLowerCase()){
					existe = true
					break
				}
			}
			if (existe) message.channel.send("Esa película ya está en la lista.")
			else {
				let peli = {
					nombre: inputpeli,
					enlace: "",
					propuesto: message.author.id,
					interesados: [message.author.id],
					no_interesados: []
				}
				lista.lista.push(peli)
				fs.writeFile("./data/lista.json", JSON.stringify(lista), function(err) {
					if (err) console.log(err)
					else message.channel.send("**" + inputpeli + "** añadida a la lista.")
				})
			}
		}
	}
};
