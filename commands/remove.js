const utils = require('../src/utils.js')
const { FilmManager } = require("../src/film_manager.js")

module.exports = {
	name: 'remove',
	description: 'quita película de la lista',
	execute(message, args, client) {
		if (!args.length) {
			message.channel.send("Escribe \"remove *nombre de la peícula*\" para quitarla de la lista.")
		}
		else {
			let inputpeli = utils.parse_film_name(message.content)
			
			if(!FilmManager.instance.exists(inputpeli)) {
				message.channel.send("La película no está en la lista.")
				console.log(inputpeli + " eliminada de la lista")
			} else {
				FilmManager.instance.remove(inputpeli)
				FilmManager.instance.save(
					on_success = () => {
						message.channel.send("**" + inputpeli + "** eliminada de la lista.")
					},
					on_error = () => {
						message.channel.send("No se ha podido eliminar **" + inputpeli + "** de la lista.")
					}
				)
			}
		}
	}
};
