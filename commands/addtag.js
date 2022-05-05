const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require("../src/film_manager.js")
const utils = require('../src/utils.js')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('addtag')
		.setDescription('añade tag a la lista de tags')
		.addStringOption(option => 
			option.setName('tag')
				.setDescription('el tag a añadir')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('ocultabilidad')
				.setDescription('Si el tag es visible (default) o está oculto')
				.setRequired(false)
				.addChoices({name: 'Visible', value: 0}, 
							{name: 'Oculto', value: 1})),
	async execute(interaction) {

		let inputtag = interaction.options.getString('tag')
		let ocultabilidad = interaction.options.getInteger('ocultabilidad')

		vibe_check = utils.vaporeon_check(inputtag) //cadena verdaderosa o false

		if(vibe_check) {
			await interaction.reply({ content: vibe_check, ephemeral: true})
			return
		}

		if(FilmManager.instance.exists_tag(inputtag)) {
			await interaction.reply({ content: "Ese tag ya está en la lista de tags.", ephemeral: true})
			return
		}
		
		FilmManager.instance.add_tag(inputtag)
		
		if(ocultabilidad){
			tag = FilmManager.instance.get_tag(inputtag)
			tag.hidden = true
		}

		FilmManager.instance.save().then( () => {
			interaction.reply("**" + inputtag + "** añadido a la lista de tags.")
		}).catch( () => {
			interaction.reply({ contents: "No se ha podido añadir ese tag :/", ephemeral: true })
		})

	},
};

