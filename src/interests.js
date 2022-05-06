const { FilmManager } = require('./film_manager.js')
const utils = require('./utils.js')

/**
 * Quita a objective de la lista de interesados o desinteresados de inputpeli.
 * Devuelve una promesa.
 * @param {string} inputpeli
 * @param {import('discord.js').User} objective
 */
exports.remove_interest_for_film = function(inputpeli, objective) {

	//TODO: cambiar objective a id?
	let peli = FilmManager.instance.get(inputpeli)
	let user = objective.id
	
	utils.remove_from_list(peli.interested, user)
	utils.remove_from_list(peli.not_interested, user)
	
	return FilmManager.instance.save()
	
	}

/**
 * Añade a objective a la lista de interesados de inputpeli, y lo quita de la lista
 * de desinteresados si es que lo está.
 * Devuelve una promesa.
 * @param {string} inputpeli
 * @param {import('discord.js').User} objective
 */
exports.add_very_interested = function(inputpeli, objective) {
	let peli = FilmManager.instance.get(inputpeli)
	let user = objective.id
	
	utils.remove_from_list(peli.not_interested, user)

	if(!peli.interested.includes(user)) {
		peli.interested.push(user)
	}

	return FilmManager.instance.save()
}


/**
 * Añade a objective a la lista de desinteresados de inputpeli, y lo quita de la lista
 * de interesados si es que lo está.
 * Devuelve una promesa.
 * @param {string} inputpeli
 * @param {import('discord.js').User} objective
 */
exports.add_not_interested = function(inputpeli, objective) {
	let peli = FilmManager.instance.get(inputpeli)
	let user = objective.id
	
	utils.remove_from_list(peli.interested, user)

	if(!peli.not_interested.includes(user)) {
		peli.not_interested.push(user)
	}

	return FilmManager.instance.save()
}
