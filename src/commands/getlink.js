const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require("../film_manager.js")
const { validate } = require("../validate_inputpeli.js")

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
		let peli = validate(inputpeli, interaction)
		if(peli == null) return;

		if(peli.link == null) {
			interaction.reply({ content: `**${peli.first_name}** no tiene enlace.`, ephemeral: true })
		} else {
			interaction.reply(`Link de **${peli.first_name}**:\n\`\`\`${peli.link}\`\`\``)
		}
	}
};
