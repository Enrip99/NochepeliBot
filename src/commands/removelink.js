const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require("../film_manager.js");
const { validate } = require('../validate_inputpeli.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('removelink')
	.setDescription('quita el enlace de una película de la lista')
	.addStringOption(option => 
		option.setName('peli')
			.setDescription('la película')
			.setRequired(true)),
	/** 
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(interaction) {

		let inputpeli = interaction.options.getString('peli')
		let peli = validate(inputpeli, interaction)
		if(peli == null) return

		peli.link = null
		console.log("Eliminado link de " + inputpeli)
		await FilmManager.instance.save().then( () => {
			interaction.reply(`Eliminado el enalce de **${inputpeli}**.`)
		}).catch(() => {
			interaction.reply({ content: `No se ha podido eliminar el enlace de **${inputpeli}** :(`, ephemeral: true })
		})

	}
};
