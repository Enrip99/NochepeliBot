const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require("../film_manager.js")

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

		if(!FilmManager.instance.exists(inputpeli)) {
			await interaction.reply({ content: "La película no está en la lista.", ephemeral: true })
			return
		} 
		
		let peli = FilmManager.instance.get(inputpeli)
		peli.link = null
		console.log("Eliminado link de " + inputpeli)
		await FilmManager.instance.save().then( () => {
			interaction.reply(`Eliminado el enalce de **${inputpeli}**.`)
		}).catch(() => {
			interaction.reply({ content: `No se ha podido eliminar el enlace de **${inputpeli}** :(`, ephemeral: true })
		})

	}
};
