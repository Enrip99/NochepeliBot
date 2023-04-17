const { SlashCommandBuilder } = require('@discordjs/builders');
const interests = require('../interests.js')
const { FilmManager } = require('../film_manager.js');
const { validate } = require('../validate_inputpeli.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('want')
	.setDescription('Te permite controlar tu nivel de interés en la peli indicada')
	.addStringOption(option => 
		option.setName('peli')
			.setDescription('la película')
			.setRequired(true))
	.addIntegerOption(option =>
		option.setName('interés')
			.setDescription('Nivel de interés (default: positivo)')
			.setRequired(false)
			.addChoices({name: '✔️ Positivo ✔️', value: +1}, 
						{name: '🤷 Neutral 🤷', value: 0}, 
						{name: '❌ Negativo ❌', value: -1})),
	/** 
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(interaction) {

		/** 
		 * @type {string}
		 * @ts-ignore */
		let inputpeli = interaction.options.getString('peli')
		/** 
		 * @type {?number}
		 * @ts-ignore */
		let inputinteres = interaction.options.getInteger('interés')
		if(inputinteres == null){
			inputinteres = 1
		}

		let user = interaction.user
		let peli = validate(inputpeli, interaction)
		if(peli == null) return

		switch(inputinteres) {
			case 1:		
				interests.add_very_interested(peli, user.id).then( () => {
					interaction.reply({ content: `Tu interés en la peli **${peli.first_name}** es ahora positivo. Evitaremos verla si no estás.`, ephemeral: true })
				}).catch( () => {
					interaction.reply({ content: `No se ha podido guardar tu gran interés en la peli **${peli.first_name}** :(. Algo se habrá roto.`, ephemeral: true})
				})
				break
			
			case 0:				
				interests.remove_interest_for_film(peli, user.id).then( () => {
					interaction.reply({ content: `Tu interés en la peli **${peli.first_name}** es ahora neutral, como Suiza.`, ephemeral: true })
				}).catch( () => {
					interaction.reply({ content: `No se ha podido guardar tu neutralidad en la peli **${peli.first_name}** :(. Algo se habrá roto.`, ephemeral: true})
				})
				break
			
			case -1:
				interests.add_not_interested(peli, user.id).then( () => {
					interaction.reply({ content: "Tu interés en la peli **" + peli.first_name +"** es ahora negativo. La veremos sin ti :).", ephemeral: true })
				}).catch( () => {
					interaction.reply({ content: `No se ha podido guardar tu desinterés en la peli **${peli.first_name}** :(. Algo se habrá roto.`, ephemeral: true})
				})
				break
		}	

	}
}
