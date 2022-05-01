const config = require('../data/config.json');
var lista = require('../data/lista.json');
const utils = require('../utils.js')
const fs = require('fs');

module.exports = {
	name: 'reallywant',
	description: 'Te registra como persona particularmente interesada en esta peli. Evitaremos verla si no estás.',
	execute(message, args, client) {
		//message.channel.send(message.author.username + " tiene muchas ganas de ver " + utils.parse_movie_name(message.content))
    //TODO Este comando está sin terminar
		if (!args.length) {
			message.channel.send("Escribe \"reallywant *nombre de la peícula*\" para añadirte como interesado.")
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
					for (let j = 0; j < lista.lista[i].interesados.length; ++j){
						if (lista.lista[i].interesados[j] == message.author.id){
							message.channel.send("Ya estás interesado en **" + inputpeli + "**.")
							existsj = true
							break
						}
					}
					if (!existsj) {
						lista.lista[i].interesados.push(message.author.id)
						let msg = "Has sido añadido a la lista de interesados de **" + inputpeli + "**."
						for (let k = 0; k < lista.lista[i].no_interesados.length; ++k){
							if (lista.lista[i].no_interesados[k] == message.author.id) {
								lista.lista[i].no_interesados.splice(k,1)
								msg += " También has sido eliminado de la lista de no interesados."
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
