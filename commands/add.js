const { FilmManager } = require("../src/film_manager.js")
const utils = require('../src/utils.js')


module.exports = {
	name: 'add',
	description: 'añade película a la lista',
	execute(message, args, client) {
		if (!args.length) {
			message.channel.send("Escribe \"add *nombre de la peícula*\" para añadirla a la lista.")
		}
		else {
			let inputpeli = utils.parse_film_name(message.content)
			if(FilmManager.instance.exists(inputpeli)) {
				message.channel.send("Esa película ya está en la lista.")
				FilmManager.instance.set_latest_film(inputpeli)
			}
			else {
				FilmManager.instance.add(inputpeli, message.author.id)
				FilmManager.instance.set_latest_film(inputpeli)
				FilmManager.instance.save(
					on_success = () => {
						message.channel.send("**" + inputpeli + "** añadida a la lista.")
					},
					on_error = () => {
						FilmManager.instance.set_latest_film(null)
						message.channel.send("No se ha podido añadir esa peli :/")
					})
			}
		}
	}
};
