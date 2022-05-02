const utils = require('../src/utils.js')
const { FilmManager } = require("../src/film_manager.js")

module.exports = {
	name: 'getlink',
	description: 'muestra el enlace de una película de la lista',
	execute(message, args, client) {
		if (!args.length) {
			message.channel.send("Escribe \"getlink *nombre de la peícula*\" para ver su enlace.")
		}
		else {
			let inputpeli = utils.parse_film_name(message.content)

			if(!FilmManager.instance.exists(inputpeli)) {
				message.channel.send("La película no está en la lista.")
			} else {
				let peli = FilmManager.instance.get(inputpeli)
				if(peli.link == null) {
					message.channel.send("**" + inputpeli + "** no tiene enlace.")
				} else {
					message.channel.send(peli.link)
				}
			}
		}
	}
};
