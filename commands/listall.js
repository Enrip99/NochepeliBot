const { SlashCommandBuilder } = require('@discordjs/builders');
const { Message } = require('../src/message.js');
const { FilmManager } = require('../src/film_manager.js');
const utils = require('../src/utils.js');

const DESCRIPTION_LIMIT = 4096

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listall')
		.setDescription('lista todas las páginas de todas las pelis'),
	async execute(interaction) {
		
		if (!FilmManager.instance.count()) {
			interaction.reply({ content: "No hay películas en la lista", ephemeral: true })
			return
		} 

		let embeds = await FilmManager.instance.list_renderer.generate_embeds(interaction.client)
		let msg = await interaction.reply({ embeds: embeds, fetchReply: true })

		FilmManager.instance.list_renderer.pinned_message = Message.from(msg)
		FilmManager.instance.save()		

		
	}
}