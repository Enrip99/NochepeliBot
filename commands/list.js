const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require('../src/film_manager.js');
const utils = require('../src/utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('lista todas las pelis'),
	async execute(interaction) {
		let tosend = ""
		if(!FilmManager.instance.count()) {
			interaction.reply({ content: "No hay películas en la lista", ephemeral: true })
			return
		} 
		
		FilmManager.instance.set_latest_film(null)
		let listmsgs = []
		let listprom = []
		for (let peli of FilmManager.instance.iterate()) {
			listmsgs.push("\n- **" + peli.first_name + "** (" + peli.interested.length + ") - Propuesta por: **")
			listprom.push(utils.get_user_by_id(interaction.client, peli.proposed_by_user))
		}

		let values = await Promise.all(listprom)

		for (let j = 0; j < values.length; ++j){
			tosend += listmsgs[j] += values[j].username + "**"
		}
		
		await interaction.reply(tosend)
	}
}