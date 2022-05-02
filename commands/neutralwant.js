const utils = require('../src/utils.js')
const { FilmManager } = require('../src/film_manager.js')

module.exports = {
	name: 'neutralwant',
	description: 'Deshace el haber indicado si una película te interesa particularmente o no te interesa.',
	execute(message, args, client) {
		if (!args.length) {
			message.channel.send("Escribe \"neutralwant *nombre de la peícula*\" para salirte de la lista de muy interesado o no interesado.")
		}
		else{
			let inputpeli = utils.parse_film_name(message.content)

			if(!FilmManager.instance.exists(inputpeli)) {
				message.channel.send("La película no está en la lista.")
			} else {
				let peli = FilmManager.instance.get(inputpeli)
				let user = message.author.id
				success = false
				success |= utils.remove_from_list(peli.interested, user)
				success |= utils.remove_from_list(peli.not_interested, user)

				if(!success) {
					message.channel.send("Tú no estabas marcado como interesado o desinteresado en **" + peli.first_name + "**.")
				} else {
					FilmManager.instance.save(
						on_success = () => {
							message.channel.send("Ahora tu interés en **" + peli.first_name + "** es neutral.")
						},
						on_error = () => {
							message.channel.send("Ha habido algún problema para actualizar tu interés en esta peli :/")
						}
					)
				}
			}
		}
	}
}
