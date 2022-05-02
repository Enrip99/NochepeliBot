const { FilmManager } = require('../src/film_manager.js')
const utils = require('./utils.js')

/**
 * Quita a objective de la lista de interesados o desinteresados de inputpeli
 */
exports.remove_interest_for_film = function(message, inputpeli, objective) {
	let peli = FilmManager.instance.get(inputpeli)
	let user = objective.id
	let success = false
	success |= utils.remove_from_list(peli.interested, user)
	success |= utils.remove_from_list(peli.not_interested, user)

	if(!success) {
		message.channel.send("<@" + user + ">, no estabas marcado como interesado o desinteresado en **" + peli.first_name + "**.")
	} else {
		FilmManager.instance.save(
			on_success = () => {
				message.channel.send("<@" + user + ">, ahora tu interés en **" + peli.first_name + "** es neutral.")
			},
			on_error = () => {
				message.channel.send("Ha habido algún problema para actualizar tu interés en esta peli :/")
			}
		)
	}
}

/**
 * Añade a objective a la lista de interesados de inputpeli, y lo quita de la lista
 * de desinteresados si es que lo está
 */
exports.add_very_interested = function(message, inputpeli, objective) {
	let peli = FilmManager.instance.get(inputpeli)
	let user = objective.id
	if(peli.interested.includes(user)) {
		message.channel.send("<@" + user + ">, ya estás puesto como muy interesado en **" + peli.first_name + "**."
			+ " Si quieres quitarte, escribe *neutralwant " + inputpeli + "*")
	} else {
		peli.interested.push(user)
		let msg = "<@" + user + ">, has sido añadido a la lista de muy interesados en **" + peli.first_name + "**."
		if(utils.remove_from_list(peli.not_interested, user)) {
			msg += " También has sido eliminado de la lista de no interesados."
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


/**
 * Añade a objective a la lista de desinteresados de inputpeli, y lo quita de la lista
 * de interesados si es que lo está
 */
exports.add_not_interested = function(message, inputpeli, objective) {
	let peli = FilmManager.instance.get(inputpeli)
	let user = objective.id
	if(peli.not_interested.includes(user)) {
		message.channel.send("<@" + user + ">, ya estás puesto como no interesado en **" + peli.first_name + "**."
			+ " Si quieres quitarte, escribe *neutralwant " + inputpeli + "*")
	} else {
		peli.not_interested.push(user)
		let msg = "<@" + user + ">, has sido añadido a la lista de no interesados en **" + peli.first_name + "**."
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
