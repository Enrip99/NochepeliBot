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

		let listmsg = []
		await utils.parallel_for(FilmManager.instance.iterate(), async peli => {
			let msg = "\n**" + peli.first_name + "**\n"
			msg += "☑️ " + peli.interested.length + " · ❎ " + peli.not_interested.length
			if(peli.not_interested.length - 3 >= peli.interested.length) {
				msg += " · ratio"
			}
			let user = await utils.get_user_by_id(interaction.client, peli.proposed_by_user)
			msg += " · Propuesta por **" + user.username + "**\n"
			listmsg.push(msg)
		})

		let embeds = utils.create_embeds_for_list("📽️✨ Pelis pendientes ✨", listmsg, DESCRIPTION_LIMIT)

		await interaction.reply({ embeds: [embeds[0]] })
	}
}