const utils = require('../src/utils.js')
const { FilmManager } = require("../src/film_manager.js")

module.exports = {
	name: 'removelink',
	description: 'quita el enlace de una película en la lista',
	execute(message, args, client) {
		if (!args.length) {
			if(FilmManager.instance.latest_film) {
				remove_link_for_film(message, FilmManager.instance.latest_film)
			} 
			else {
				message.channel.send("Escribe \"removelink *nombre de la peícula*\" para quitarle su enlace.")
			}
		}
		else {
			let inputpeli = utils.parse_film_name(message.content)

			if(!FilmManager.instance.exists(inputpeli)) {
				FilmManager.instance.set_latest_film(null)
				message.channel.send("La película no está en la lista.")
			} else {
				let peli = FilmManager.instance.get(inputpeli)
				FilmManager.instance.set_latest_film(inputpeli)
				remove_link_for_film(message, inputpeli)
			}
		}
	}
};


function remove_link_for_film(message, inputpeli) {
	peli.link = null
	console.log("Eliminado link de " + inputpeli)
	FilmManager.instance.save(
		on_success = () => {
			message.channel.send("Eliminado el enalce de **" + inputpeli + "**.")
		},
		on_error = () => {
			message.channel.send("No se ha podido eliminar el enlace de **" + inputpeli + "** ")
		}
	)
}
