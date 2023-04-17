const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require("../film_manager.js");
const { validate } = require('../validate_inputpeli.js');

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

		/** 
		 * @type {string}
		 * @ts-ignore */
		let inputpeli = interaction.options.getString('peli')
		let peli = validate(inputpeli, interaction)
		if(!peli) return //Evitamos que pete si hay varios matches.

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
