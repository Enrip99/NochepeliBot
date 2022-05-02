const utils = require('../src/utils.js')
const interests = require('../src/interest.js')
const { FilmManager } = require('../src/film_manager.js')

module.exports = {
	name: 'neutralwant',
	description: 'Deshace el haber indicado si una película te interesa particularmente o no te interesa.',
	execute(message, args, client) {
		if (!args.length) {
			if(FilmManager.instance.latest_film) {
				interests.remove_interest_for_film(message, FilmManager.instance.latest_film, message.author)
			}
			else {
				message.channel.send("Escribe \"neutralwant *nombre de la peícula*\" para salirte de la lista de muy interesado o no interesado.")
			}
		}
		else{
			let inputpeli = utils.parse_film_name(message.content)

			if(!FilmManager.instance.exists(inputpeli)) {
				FilmManager.instance.set_latest_film(null)
				message.channel.send("La película no está en la lista.")
			} else {
				FilmManager.instance.set_latest_film(inputpeli)
				interests.remove_interest_for_film(message, inputpeli, message.author)
			}
		}
	}
}
