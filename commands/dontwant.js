const config = require('../data/config.json');
var lista = require('../data/lista.json');
const utils = require('../utils.js')
const fs = require('fs');

module.exports = {
	name: 'dontwant',
	description: 'Te registra como persona no interesada en la peli que digas. La veremos sin ti :)',
	execute(message, args, client) {
		//message.channel.send(message.author.username + " tiene muchas ganas de ver " + utils.parse_movie_name(message.content))

		if (!args.length) {
			message.channel.send("Escribe \"dontwant *nombre de la peícula*\" para añadirte como interesado.")
		}
		else{
			let inputpeli = message.content.split(' ')
			inputpeli.shift()
			inputpeli = inputpeli.join(' ').trim()
			let existsi = false

			for (let i = 0; i < lista.lista.length; ++i){
				if (inputpeli.toLowerCase() === lista.lista[i].nombre.toLowerCase()) {
					existsi = true
					let existsj = false;
					for (let j = 0; j < lista.lista[i].no_interesados.length; ++j){
						if (lista.lista[i].no_interesados[j] == message.author.id){
							message.channel.send("Ya estás como no interesado en **" + inputpeli + "**.")
							existsj = true
							break
						}
					}
					if (!existsj) {
						lista.lista[i].no_interesados.push(message.author.id)
						let msg = "Has sido añadido a la lista de no interesados en **" + inputpeli + "**."
						for (let k = 0; k < lista.lista[i].interesados.length; ++k){
							if (lista.lista[i].interesados[k] == message.author.id) {
								lista.lista[i].interesados.splice(k,1)
								msg += " También has sido eliminado de la lista de interesados."
							}
						}
						fs.writeFile("./data/lista.json", JSON.stringify(lista), function(err) {
							if (err) console.log(err)
							else message.channel.send(msg)
						})
					}
					break
				}
			}
			if (!existsi) message.channel.send("La película no está en la lista.")
		}
	}
}
