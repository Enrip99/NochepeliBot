const { Film } = require('./film.js')
const { FilmManager } = require('./film_manager.js')
const utils = require('./utils.js')

/**
 * Quita a objective de la lista de interesados o desinteresados de inputpeli.
 * Devuelve una promesa.
 * @param {Film} peli
 * @param {import('discord.js').Snowflake} user_id
 */
exports.remove_interest_for_film = async function(peli, user_id) {
	
	let interest_updated = false
	interest_updated ||= utils.remove_from_list(peli.interested, user_id)
	interest_updated ||= utils.remove_from_list(peli.not_interested, user_id)
	
	await FilmManager.instance.save()
	return interest_updated
}

/**
 * Añade a objective a la lista de interesados de peli, y lo quita de la lista
 * de desinteresados si es que lo está.
 * Devuelve una promesa.
 * @param {Film} peli
 * @param {import('discord.js').Snowflake} user_id
 */
exports.add_very_interested = async function(peli, user_id) {

	let interest_updated = false
	utils.remove_from_list(peli.not_interested, user_id)

	if(!peli.interested.includes(user_id)) {
		peli.interested.push(user_id)
		interest_updated = true
	}

	await FilmManager.instance.save()
	return interest_updated
}


/**
 * Añade a objective a la lista de desinteresados de peli, y lo quita de la lista
 * de interesados si es que lo está.
 * Devuelve una promesa.
 * @param {Film} peli
 * @param {import('discord.js').Snowflake} user_id
 */
exports.add_not_interested = async function(peli, user_id) {
	
	let interest_updated = false
	utils.remove_from_list(peli.interested, user_id)

	if(!peli.not_interested.includes(user_id)) {
		peli.not_interested.push(user_id)
		interest_updated = true
	}

	await FilmManager.instance.save()
	return interest_updated
}


/**
 * Comprueba en qué películas está muy interesado, neutralmente interesado, o no interesado el usuario.
 * Devuelve una promesa.
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
