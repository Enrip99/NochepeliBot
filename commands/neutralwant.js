const config = require('../data/config.json');
var lista = require('../data/lista.json');
const utils = require('../utils.js')
const fs = require('fs');

module.exports = {
	name: 'neutralwant',
	description: 'Deshace el haber indicado si una película te interesa particularmente o no te interesa.',
	execute(message, args, client) {
		if (!args.length) {
			message.channel.send("Escribe \"neutralwant *nombre de la peícula*\" psalirte de la lista de interesado o no interesado.")
		}
		else{
			let inputpeli = message.content.split(' ')
			inputpeli.shift()
			inputpeli = inputpeli.join(' ').trim()
			let existei = false
			for (let i = 0; i < lista.lista.length; ++i){
				if (inputpeli.toLowerCase() === lista.lista[i].nombre.toLowerCase()){
					let existej = false
					for (let j = 0; j < lista.lista[i].interesados.length; ++j){
						if (lista.lista[i].interesados[j] == message.author.id){
							existej = true
							lista.lista[i].interesados.splice(j,1)
							fs.writeFile("./data/lista.json", JSON.stringify(lista), function(err) {
								if (err) console.log(err)
								else message.channel.send("Has sido eliminado de la lista de interesados en **" + inputpeli + "**.")
							})
							break
						}
					}

					for (let j = 0; j < lista.lista[i].no_interesados.length; ++j){
						if (lista.lista[i].no_interesados[j] == message.author.id){
							existej = true
							lista.lista[i].no_interesados.splice(j,1)
							fs.writeFile("./data/lista.json", JSON.stringify(lista), function(err) {
								if (err) console.log(err)
								else message.channel.send("Has sido eliminado de la lista de no interesados en **" + inputpeli + "**.")
							})
							break
						}
					}

					if (!existej) message.channel.send("No estás en ninguna lista para **" + inputpeli + "**.")
					existei = true
					break
				}
			}
			if (!existei) message.channel.send("La película no está en la lista.")
		}
	}
}
