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


/**
 * Comprueba en qué películas está muy interesado, neutralmente interesado, o no interesado el usuario.
 * Devuelve una promesa.
 * @typedef {import("./film.js").Film} Film
 * @param { import("discord.js").Snowflake } userid
 * @returns { Promise< Record<string, Film[]> > }
 */
exports.get_user_interest_list = function( userid ) {

	//TODO: combinar las otras 3 funciones en una, como aquí
	//TODO: cambiar intereses a strings, en general (¿creas clase?)
	/** @type { Record<string, Film[]> } */
	let interest_lists = {'negativo':[], 'neutral':[], 'positivo':[]}

	return new Promise((resolve, reject) => {

		try{			
			for( let peli of FilmManager.instance.iterate() ){
				if( peli.interested.includes(userid) ){
					interest_lists['positivo'].push(peli)
				} else if( peli.not_interested.includes(userid) ){
					interest_lists['negativo'].push(peli)
				} else {
					interest_lists['neutral'].push(peli)
				}
			}
			resolve(interest_lists)

		} catch(e) {
			reject(e)
		}
			
	})
	
}
