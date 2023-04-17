const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require("../film_manager.js")
const utils = require('../utils.js');
const { validate } = require('../validate_inputpeli.js');


module.exports = {
	data: new SlashCommandBuilder()
	.setName('whowants')
	.setDescription('Comprueba quien quiere o no ver una película')
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
		if(peli == null) return

		let interested_msg = "✔️ "
		let not_interested_msg = "\n\n❌ "
		let interested_promises = []
		
		if(peli.interested.length === 0) {
			interested_msg += `No hay nadie particularmente interesado en ver **${peli.first_name}**.`
		}
		else {
			interested_msg += `Gente interesada en ver **${peli.first_name}**:`
			for (let user of peli.interested) {
				interested_promises.push(utils.get_user_by_id(interaction.client, user))
			}
		}
		if (peli.not_interested.length === 0) {
			not_interested_msg += `No hay nadie que no quiera ver **${peli.first_name}**.`
		}
		else {
			not_interested_msg += `Gente sin interés en ver **${peli.first_name}**:`
			for (let user of peli.not_interested){
				interested_promises.push(utils.get_user_by_id(interaction.client, user))
			}
		}
		let i = 0;
		let values = await Promise.all(interested_promises)
		for (let value of values) {
			if (i == peli.interested.length) interested_msg += not_interested_msg
			++i
			interested_msg += `\n- **${value.username}**`
		}
		if (peli.not_interested.length == 0) interested_msg += not_interested_msg
		interaction.reply(interested_msg)

	}
};

