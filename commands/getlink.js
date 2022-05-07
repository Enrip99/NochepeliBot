const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require("../src/film_manager.js")

module.exports = {
	data: new SlashCommandBuilder()
	.setName('getlink')
	.setDescription('muesta el enlrace de una película de la lista')
	.addStringOption(option => 
		option.setName('peli')
			.setDescription('la película')
			.setRequired(true)),
	/** 
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(interaction) {

		let inputpeli = interaction.options.getString('peli')

		if(!FilmManager.instance.exists(inputpeli)) {
			interaction.reply({ content: "La película no está en la lista.", ephemeral: true })
			return
		} 

		let peli = FilmManager.instance.get(inputpeli)
		if(peli.link == null) {
			interaction.reply({ content: `**${inputpeli}** no tiene enlace.`, ephemeral: true })
		} else {
			interaction.reply(`Link de **${peli.first_name}**:\n\`\`\`${peli.link}\`\`\``)
		}

	}
};
