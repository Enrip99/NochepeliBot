const config = require('../data/config.json');
var lista = require('../data/lista.json');
const fs = require('fs');

module.exports = {
	name: 'remove',
	description: 'quita peli de la lista',
	execute(message, args, client) {
		if (!args.length) {
			message.channel.send("Escribe \"remove *nombre de la peícula*\" para quitarla de la lista.")
		}
		else {
			var peli = message.content.substring(7,message.content.length).trim()
			var exists = false
			for (var i = 0; i < lista.lista.length; ++i){
				if (peli.toLowerCase() === lista.lista[i].toLowerCase()) {
					exists = true
					lista.lista.splice(i,1)
					fs.writeFile("./data/lista.json", JSON.stringify(lista), function(err) {
						if (err) console.log(err)
						else message.channel.send("**" + peli + "** eliminada de la lista.")
					})
					break
				}
			}
			if (!exists) message.channel.send("La peli no está en la lista.")
		}
	}
};
