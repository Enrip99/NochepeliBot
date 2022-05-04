const { SlashCommandBuilder } = require('@discordjs/builders');
const utils = require('../src/utils.js')
const { FilmManager } = require("../src/film_manager.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('quita película de la lista')
		.addStringOption(option => 
			option.setName('peli')
				.setDescription('la película a quitar')
				.setRequired(true)),
	async execute(interaction) {
		let inputpeli = interaction.options.getString('peli')

		if(!FilmManager.instance.exists(inputpeli)) {
			await interaction.reply({ content: "La película no está en la lista.", ephemeral: true })
			return
		} 
		
		peli = FilmManager.instance.get(inputpeli)
		FilmManager.instance.remove(inputpeli)
		await FilmManager.instance.save().then( () => {
			interaction.reply("**" + peli.first_name + "** eliminada de la lista.")
		}).catch( () => {
			interaction.reply({ content: "No se ha podido eliminar **" + peli.first_name + "** de la lista.", ephemeral: true })
		})
	}
};
