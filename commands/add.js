const config = require('../data/config.json');
var lista = require('../data/lista.json');
const fs = require('fs');

module.exports = {
	name: 'add',
	description: 'añade peli a la lista',
	execute(message, args, client) {
		if (!args.length) {
			message.channel.send("Escribe \"add *nombre de la peícula*\" para añadirla a la lista.")
		}
		else {
			var peli = message.content.substring(4,message.content.length).trim()
			var exists = false
			for (var i = 0; i < lista.lista.length; ++i){
				if (peli.toLowerCase() === lista.lista[i].toLowerCase()) exists = true
			}
			if (exists) message.channel.send("Esa peli ya está en la lista.")
			else {
				lista.lista.push(peli)
				fs.writeFile("./data/lista.json", JSON.stringify(lista), function(err) {
					if (err) console.log(err)
					else message.channel.send("**" + peli + "** añadida a la lista.")
				})
			}
		}
	}
};
