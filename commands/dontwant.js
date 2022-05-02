const utils = require('../src/utils.js')
const { FilmManager } = require('../src/film_manager.js')

module.exports = {
	name: 'dontwant',
	description: 'Te registra como persona no interesada en la peli que digas. La veremos sin ti :)',
	execute(message, args, client) {

		if (!args.length) {
			message.channel.send("Escribe \"dontwant *nombre de la peícula*\" para añadirte como interesado.")
		}
		else{
			let inputpeli = utils.parse_film_name(message.content)

			if(!FilmManager.instance.exists(inputpeli)) {
				message.channel.send("La película no está en la lista.")
			} else {
				let peli = FilmManager.instance.get(inputpeli)
				let user = message.author.id
				if(peli.not_interested.includes(user)) {
					message.channel.send("Tú ya estás puesto como no interesado en **" + peli.first_name + "**."
						+ " Si quieres quitarte, escribe *neutralwant " + inputpeli + "*")
				} else {
					peli.not_interested.push(user)
					let msg = "Has sido añadido a la lista de no interesados en **" + peli.first_name + "**."
					if(utils.remove_from_list(peli.interested, user)) {
						msg += " También has sido eliminado de la lista de muy interesados."
					}
					
					FilmManager.instance.save(
						on_success = () => {
							message.channel.send(msg)
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
