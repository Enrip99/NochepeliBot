const config = require('../data/config.json');
var lista = require('../data/lista.json');
const fs = require('fs');

module.exports = {
	name: 'removelink',
	description: 'quita el enlace de una película en la lista',
	execute(message, args, client) {
		if (!args.length) {
			message.channel.send("Escribe \"removelink *nombre de la peícula*\" para quitarle su enlace.")
		}
		else {
			let inputpeli = message.content.split(' ')
			inputpeli.shift()
			inputpeli = inputpeli.join(' ').trim()
			let exists = false
			for (let i = 0; i < lista.lista.length; ++i){
				if (inputpeli.toLowerCase() === lista.lista[i].nombre.toLowerCase()) {
					exists = true
					lista.lista[i].enlace = ""
					fs.writeFile("./data/lista.json", JSON.stringify(lista), function(err) {
						if (err) console.log(err)
						else message.channel.send("Eliminado el enalce de **" + inputpeli + "**.")
					})
					break
				}
			}
			if (!exists) message.channel.send("La película no está en la lista.")
		}
	}
};
