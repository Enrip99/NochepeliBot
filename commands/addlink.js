const config = require('../data/config.json');
var lista = require('../data/lista.json');
const fs = require('fs');

//input: addlink <link> <nombre peli>

module.exports = {
	name: 'addlink',
	description: 'añadeo modifica el enlace de una película de la lista',
	execute(message, args, client) {
		if (args.length < 2) {
			message.channel.send("Escribe \"addlink *enlace* *nombre de la peícula*\" para añadir el enlace a la película.")
		}
		else {
			let inputlink = args[0]
			let inputpeli = message.content.split(' ')
			inputpeli.shift()
			inputpeli.shift()
			inputpeli = inputpeli.join(' ').trim()
			let existe = false
			for (let i = 0; i < lista.lista.length; ++i){
				if (inputpeli.toLowerCase() === lista.lista[i].nombre.toLowerCase()){
					existe = true
					let actualizar = false
					if (lista.lista[i].enlace != "") actualizar = true
					lista.lista[i].enlace = inputlink
					fs.writeFile("./data/lista.json", JSON.stringify(lista), function(err) {
						if (err) console.log(err)
						else {
							if (actualizar) message.channel.send("Enlace actualizado para la peli **" + inputpeli +  "**.")
							else message.channel.send("Enlace añadido a la peli **" + inputpeli +  "**.")
						}
					})
				}
			}
			if (!existe) message.channel.send("La película no esa en la lista.")
		}
	}
};
