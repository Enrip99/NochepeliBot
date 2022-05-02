const config = require('../data/config.json');
var lista = require('../data/lista.json');
const fs = require('fs');

module.exports = {
	name: 'whowants',
	description: 'Comprueba quien quiere o no ver una película',
	execute(message, args, client) {
		if (!args.length) {
			message.channel.send("Escribe \"whowants *nombre de la peícula*\" para ver quien quiere ver o no la película.")
		}
		else {
			let inputpeli = message.content.split(' ')
			inputpeli.shift()
			inputpeli = inputpeli.join(' ').trim()

			let exists = false
			for (let i = 0; i < lista.lista.length; ++i){
				if (inputpeli.toLowerCase() === lista.lista[i].nombre.toLowerCase()) {
					exists = true
					let inter = ""
					let nointer = ""
					let promnointer = []
					let prominter = []
					if (!lista.lista[i].interesados.length) {
						inter += "No hay nadie particularment interesado en ver **" + inputpeli + "**."
					}
					else {
						inter += "Gente interesada en ver **" + inputpeli + "**:"
						for (let j = 0; j < lista.lista[i].interesados.length; ++j){
							prominter[j] = client.users.fetch(String(lista.lista[i].interesados[j]))
						}
					}

					if (!lista.lista[i].no_interesados.length) {
						nointer += "No hay nadie no interesado en ver **" + inputpeli + "**."
					}
					else {
						nointer += "Gente sin interés en ver **" + inputpeli + "**:"
						for (let j = 0; j < lista.lista[i].no_interesados.length; ++j){
							promnointer[j] = client.users.fetch(String(lista.lista[i].no_interesados[j]))
						}
					}

					Promise.all(prominter).then(values => {
						for (let j = 0; j < values.length; ++j){
							inter += "\n- **" + values[j].username + "**"
						}
						message.channel.send(inter)
					})

					Promise.all(promnointer).then(values => {
						for (let j = 0; j < values.length; ++j){
							nointer += "\n- **" + values[j].username + "**"
						}
						message.channel.send(nointer)
					})
					break
				}
			}
			if (!exists) message.channel.send("La película no está en la lista.")
		}
	}
};
