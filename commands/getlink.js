const utils = require('../src/utils.js')
const { FilmManager } = require("../src/film_manager.js")

module.exports = {
	name: 'getlink',
	description: 'muestra el enlace de una película de la lista',
	execute(message, args, client) {
		if (!args.length) {
			if(FilmManager.instance.latest_film) {
				get_link_for_film(message, FilmManager.instance.latest_film)
			}
			else {
				message.channel.send("Escribe \"getlink *nombre de la peícula*\" para ver su enlace.")
			}
		}
		else {
			let inputpeli = utils.parse_film_name(message.content)
			get_link_for_film(message, inputpeli)
		}
	}
};


function get_link_for_film(message, inputpeli) {
	if(!FilmManager.instance.exists(inputpeli)) {
		FilmManager.instance.set_latest_film(null)
		message.channel.send("La película no está en la lista.")
	} else {
		let peli = FilmManager.instance.get(inputpeli)
		FilmManager.instance.set_latest_film(inputpeli)
		if(peli.link == null) {
			message.channel.send("**" + inputpeli + "** no tiene enlace.")
		} else {
			message.channel.send(peli.link)
		}
	}
}