const utils = require('../src/utils.js')
const { FilmManager } = require("../src/film_manager.js")

module.exports = {
	name: 'mention',
	description: 'quita película de la lista',
	execute(message, args, client) {
		if (!args.length) {
			message.channel.send("Escribe \"mention *nombre de la peícula*\" para mencionar a todos los interesados.")
		}
		else {
			let inputpeli = utils.parse_film_name(message.content)

			if(!FilmManager.instance.exists(inputpeli)) {
				message.channel.send("La película no está en la lista.")
			}
			else {
				peli = FilmManager.instance.get(inputpeli)
				let tosend = ""
				if (!peli.interested.length){
					tosend = "No hay nadie interesado en ver la película."
				}
				else {
					tosend = "<@" + message.author.id + "> quiere ver **" + peli.first_name + "**. Llamando a los interesados:"
					for (let i = 0; i < peli.interested.length; ++i){
						tosend += " <@" + peli.interested[i] + ">"
					}
				}
				message.channel.send(tosend)
			}
		}
	}
};
