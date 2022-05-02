const utils = require('../src/utils.js')
const interests = require('../src/interest.js')
const { FilmManager } = require('../src/film_manager.js')

module.exports = {
	name: 'dontwant',
	description: 'Te registra como persona no interesada en la peli que digas. La veremos sin ti :)',
	execute(message, args, client) {

		if (!args.length) {
			if(FilmManager.instance.latest_film) {
				interests.add_not_interested(message, FilmManager.instance.latest_film, message.author)
			}
			else {
				message.channel.send("Escribe \"dontwant *nombre de la peícula*\" para añadirte como interesado.")
			}
		}
		else{
			let inputpeli = utils.parse_film_name(message.content)

			if(!FilmManager.instance.exists(inputpeli)) {
				FilmManager.instance.set_latest_film(null)
				message.channel.send("La película no está en la lista.")
			} else {
				FilmManager.instance.set_latest_film(inputpeli)
				interests.add_not_interested(message, inputpeli, message.author)
			}
		}
	}
}
