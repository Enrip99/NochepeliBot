const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require("../src/film_manager.js")

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

		let inputpeli = interaction.options.getString('peli')
		let inputlink = interaction.options.getString('link')
		
		let peli = FilmManager.instance.get(inputpeli)
		if(!peli) {
			await interaction.reply({ content: "La película no está en la lista.", ephemeral: true })
			return
		}
		
		let actualizar = peli.link != null
		peli.link = inputlink
		console.log("Actualizado link para peli " + inputpeli)

		await FilmManager.instance.save().then( () => {
				if(actualizar) {
					interaction.reply("Enlace actualizado para la peli **" + inputpeli +  "**.")
				} else {
					interaction.reply("Enlace añadido a la peli **" + inputpeli +  "**.")
				}
			}).catch( () => {
				interaction.reply({ content: "No se ha podido poner ese enlace a la peli.", ephemeral: true })
			})
			
	}
}