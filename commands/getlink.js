const config = require('../data/config.json');
var lista = require('../data/lista.json');
const fs = require('fs');

module.exports = {
	name: 'getlink',
	description: 'muestra el enlace de una película de la lista',
	execute(message, args, client) {
		if (!args.length) {
			message.channel.send("Escribe \"getlink *nombre de la peícula*\" para ver su enlace.")
		}
		else {
			let inputpeli = message.content.split(' ')
			inputpeli.shift()
			inputpeli = inputpeli.join(' ').trim()
			let exists = false
			for (let i = 0; i < lista.lista.length; ++i){
				if (inputpeli.toLowerCase() === lista.lista[i].nombre.toLowerCase()) {
					if (lista.lista[i].enlace == "") message.channel.send("**" + inputpeli + "** no tiene enlace.")
					else message.channel.send(lista.lista[i].enlace)
					exists = true
					break
				}
			}
			if (!exists) message.channel.send("La película no está en la lista.")
		}
	}
};
