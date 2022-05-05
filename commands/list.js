const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { FilmManager } = require('../src/film_manager.js');
const utils = require('../src/utils.js');

const DESCRIPTION_LIMIT = 4096

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('lista todas las pelis por páginas'),
		async execute(interaction) {
		
			if (!FilmManager.instance.count()) {
				interaction.reply({ content: "No hay películas en la lista", ephemeral: true })
				return
			} 
	
			let embeds = await FilmManager.instance.list_renderer.generate_embeds(interaction.client, undefined, DESCRIPTION_LIMIT)
			await interaction.reply({ embeds: [embeds[0]] })
		
			
		}
	}