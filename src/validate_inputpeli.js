const { FilmManager } = require("./film_manager")
const utils = require("./utils.js")


/**
 * Método plantilla para no tener que hacer esta validación en cada comando. Está en un archivo aparte para evitar un
 * ciclo de dependencias; si pusiéramos este método en utils.js, ya no podríamos utilizar utils en film_manager.js
 * @param {string} inputpeli 
 * @param {import("discord.js").CommandInteraction} interaction
 */
exports.validate = function(inputpeli, interaction) {
    let peli = FilmManager.instance.get_film_fuzzy(inputpeli)

    if(peli instanceof Array) {
		let matched_pelis = new Set(peli.map(f => f.first_name))
		interaction.reply({
			content:
			`Sé más específico, hay ${utils.numbers_as_text(matched_pelis.size)} pelis a las que te puedes ` +
            `estar refiriendo: ${utils.list_as_readable_text(...matched_pelis)}`,
			ephemeral: true
		})
		return null
	} else if(peli == null) {
		interaction.reply({ content: `No hay ninguna película "${inputpeli}" en la lista`, ephemeral: true })
		return null
	}

    return peli
}