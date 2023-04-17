const { SlashCommandBuilder } = require('@discordjs/builders');
const { Message } = require('../message.js');
const { FilmManager } = require('../film_manager.js');
const DiscordMessage = require('discord.js').Message;
const utils = require('../utils.js');

const DESCRIPTION_LIMIT = 4096

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listall')
		.setDescription('lista todas las páginas de todas las pelis')
		.addIntegerOption(option =>
			option.setName('autoupdate')
				.setDescription('Si la lista se actualiza automáticamente o no (default)')
				.setRequired(false)
				.addChoices({name: 'No actualizar', value: 0}, 
							{name: 'Autoactualizar (CUIDAO QUE ESTO HACE QUE LA LISTA ANTERIOR DEJE DE ACTUALIZARSE)', value: 1})),
	/** 
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(interaction) {

		/** 
		 * @type {?number}
		 * @ts-ignore */
		let autoupdate = !!interaction.options.getInteger('autoupdate') //booleano
		
		if (!FilmManager.instance.count()) {
			interaction.reply({ content: "No hay películas en la lista", ephemeral: true })
			return
		} 

		let embeds = await FilmManager.instance.list_renderer.generate_embeds(interaction.client)
		let msg = await interaction.reply({ embeds: embeds, fetchReply: true })
		if(!(msg instanceof DiscordMessage)) return

		if(autoupdate){
			if(FilmManager.instance.list_renderer.pinned_message != null) {
				interaction.followUp("A partir de ahora estaré actualizando esta lista. Además, dejaré de actualizar la lista anterior")
			} else {
				interaction.followUp("A partir de ahora estaré actualizando esta lista")
			}
	
			FilmManager.instance.list_renderer.pinned_message = Message.from(msg)
			FilmManager.instance.save()					
		}

		
	}
}