const { SlashCommandBuilder } = require('@discordjs/builders');
const interests = require('../src/interests.js')
const { FilmManager } = require('../src/film_manager.js')

module.exports = {
	data: new SlashCommandBuilder()
	.setName('want')
	.setDescription('Te permite controlar tu nivel de interés en la peli dada.')
	.addStringOption(option => 
		option.setName('peli')
			.setDescription('la película')
			.setRequired(true))
	.addIntegerOption(option =>
		option.setName('interés')
			.setDescription('Nivel de interés')
			.setRequired(true)
			.addChoices({name: '✔️ Positivo ✔️', value: +1}, 
						{name: '🤷 Neutral 🤷', value:0}, 
						{name: '❌ Negativo ❌', value: -1})),
	/** 
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(interaction) {

		let inputpeli = interaction.options.getString('peli')
		let inputinteres = interaction.options.getInteger('interés')

		let user = interaction.user
		let peli = FilmManager.instance.get(inputpeli)

		if(!peli) { //peli == null
			interaction.reply({ content: "La película no está en la lista.", ephemeral: true })
			return
		}

		switch(inputinteres){
			case 1:		
				interests.add_very_interested(inputpeli, user).then( () => {
					interaction.reply({ content: `Tu interés en la peli **${peli.first_name}** es ahora positivo. Evitaremos verla si no estás.`, ephemeral: true })
				}).catch( () => {
					interaction.reply({ content: `No se ha podido guardar tu gran interés en la peli **${peli.first_name}** :(. Algo se habrá roto.`})
				})
				break
			
			case 0:				
				interests.remove_interest_for_film(inputpeli, user).then( () => {
					interaction.reply({ content: `Tu interés en la peli **${peli.first_name}** es ahora neutral, como Suiza.`, ephemeral: true })
				}).catch( () => {
					interaction.reply({ content: `No se ha podido guardar tu neutralidad en la peli **${peli.first_name}** :(. Algo se habrá roto.`})
				})
				break
			
			case -1:
				interests.add_not_interested(inputpeli, user).then( () => {
					interaction.reply({ content: "Tu interés en la peli **" + peli.first_name +"** es ahora negativo. La veremos sin ti :).", ephemeral: true })
				}).catch( () => {
					interaction.reply({ content: `No se ha podido guardar tu desinterés en la peli **${peli.first_name}** :(. Algo se habrá roto.`})
				})
				break
		}	

	}
}
