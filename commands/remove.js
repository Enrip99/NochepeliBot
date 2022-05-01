const config = require('../data/config.json');
var lista = require('../data/lista.json');
const fs = require('fs');

module.exports = {
	name: 'remove',
	description: 'quita película de la lista',
	execute(message, args, client) {
		if (!args.length) {
			message.channel.send("Escribe \"remove *nombre de la peícula*\" para quitarla de la lista.")
		}
		else {
			let inputpeli = message.content.substring(7,message.content.length).trim()
			let exists = false
			for (let i = 0; i < lista.lista.length; ++i){
				if (inputpeli.toLowerCase() === lista.lista[i].nombre.toLowerCase()) {
					exists = true
					lista.lista.splice(i,1)
					fs.writeFile("./data/lista.json", JSON.stringify(lista), function(err) {
						if (err) console.log(err)
						else message.channel.send("**" + inputpeli + "** eliminada de la lista.")
					})
					break
				}
			}
			if (!exists) message.channel.send("La película no está en la lista.")
		}
	}
};
