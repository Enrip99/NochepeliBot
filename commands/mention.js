const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require("../src/film_manager.js")

module.exports = {
	data: new SlashCommandBuilder()
	.setName('mention')
	.setDescription('menciona a los usuarios interesados')
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
			interaction.reply({ content:"La película no está en la lista.", ephemeral: true })
			return
		}

		let peli = FilmManager.instance.get(inputpeli)
		let tosend = ""
		if (!peli.interested.length){
			interaction.reply("No hay nadie interesado en ver la película.")
			return
		}

		tosend = `<@${interaction.user.id}> quiere ver **${peli.first_name}**. Llamando a los interesados:`
		for (let i = 0; i < peli.interested.length; ++i){
			tosend += ` <@${peli.interested[i]}>`
		}

		await interaction.reply(tosend)
		}
};
