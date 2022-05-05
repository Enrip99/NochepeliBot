const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require('../src/film_manager.js');

const DESCRIPTION_LIMIT = 600

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('lista todas las pelis por páginas')
		.addStringOption(option => 
			option.setName('tag')
				.setDescription('el tag por el que filtrar')
				.setRequired(false)),
		async execute(interaction) {

			let inputtag = interaction.options.getString('tag')
			let tag = inputtag ? FilmManager.instance.get_tag(inputtag) : null
			let include_hidden = !!tag //incluimos los ocultos si y solo si el tag no es nulo
			let iterable = tag ? FilmManager.instance.films_with_tag(inputtag) : null


			if ( inputtag && !tag ) { //si el tag no existe
				interaction.reply({ content: `El tag **${inputtag}** no existe :(`, ephemeral: true })
				return
			}
		
			if (!FilmManager.instance.count() || (tag && !iterable.length)) {
				interaction.reply({ content: "No hay películas en la lista", ephemeral: true })
				return
			} 
	
			let embeds = await FilmManager.instance.list_renderer.generate_embeds(interaction.client, undefined, DESCRIPTION_LIMIT, include_hidden, iterable)
			await interaction.reply({ embeds: [embeds[0]] })
		
			
		}
	}