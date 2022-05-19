const { SlashCommandBuilder } = require('@discordjs/builders');
const utils = require('../utils.js')
const { FilmManager } = require("../film_manager.js");
const { validate } = require('../validate_inputpeli.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('quita película de la lista')
		.addStringOption(option => 
			option.setName('peli')
				.setDescription('la película a quitar')
				.setRequired(true)),
	/** 
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(interaction) {
		let inputpeli = interaction.options.getString('peli')
		let peli = validate(inputpeli, interaction)
		if(peli == null) return

		// Solo por asegurarse...
		let sanitized_inputpeli = utils.sanitize_film_name(inputpeli)
		if(sanitized_inputpeli != peli.sanitized_name) {
			interaction.reply({
				content: `Entiendo que te refieres a **${peli.first_name}**, pero solo para estar seguros de que no borro la que no es, ` 
					+ `vuelve a usar \`/remove\` con el nombre de la peli tal cual lo tengo registrado (lo que acabo de poner en negrita)`,
				ephemeral: true
			})
			return
		}

		FilmManager.instance.remove(inputpeli)
		await FilmManager.instance.save().then( () => {
			interaction.reply(`**${peli.first_name}** eliminada de la lista.`)
		}).catch( () => {
			interaction.reply({ content: `No se ha podido eliminar **${peli.first_name}** de la lista.`, ephemeral: true })
		})
	}
};
