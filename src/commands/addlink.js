const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require("../film_manager.js")
const utils = require("../utils.js");
const { validate } = require('../validate_inputpeli.js');

//input: addlink <nombre peli> <link>

module.exports = {
	data: new SlashCommandBuilder()
	.setName('addlink')
	.setDescription('añade o modifica el enlace de una película de la lista')
	.addStringOption(option => 
		option.setName('peli')
			.setDescription('la película')
			.setRequired(true))
	.addStringOption(option => 
		option.setName('link')
			.setDescription('El Hipervínculo')
			.setRequired(true)),

	/** 
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(interaction) {

		/** 
		 * @type {string}
		 * @ts-ignore */
		let inputpeli = interaction.options.getString('peli')
		/** 
		 * @type {string}
		 * @ts-ignore */
		let inputlink = interaction.options.getString('link')
		
		let peli = validate(inputpeli, interaction)
		if(peli == null) return
		
		let actualizar = peli.link != null
		peli.link = inputlink
		console.log(`Actualizado link para peli ${inputpeli}`)

		try {
			await FilmManager.instance.save()
			if(actualizar) {
				interaction.reply(`Enlace actualizado para la peli **${peli.first_name}**.\n\`\`\`${peli.link}\`\`\``)
			} else {
				interaction.reply(`Enlace añadido a la peli **${peli.first_name}**.\n\`\`\`${peli.link}\`\`\``)
			}
		} catch(e) {
			console.error(e)
			interaction.reply({ content: "No se ha podido poner ese enlace a la peli.", ephemeral: true })
		}
			
	}
}