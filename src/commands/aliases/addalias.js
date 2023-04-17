const { SlashCommandBuilder } = require("@discordjs/builders");
const { validate } = require("../../validate_inputpeli");
const utils = require("../../utils.js");
const { FilmManager } = require("../../film_manager");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addalias')
		.setDescription('añade un alias a la peli para que pueda usarse como nombre alternativo')
		.addStringOption(option => 
			option.setName('peli')
				.setDescription('la película a la que corresponde el nuevo alias')
				.setRequired(true))
		.addStringOption(option => 
			option.setName('alias')
				.setDescription('alias para la peli')
				.setRequired(true)),

	/**
	 * 
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
		let inputalias = interaction.options.getString('alias')

		let vibe_check = utils.vaporeon_check(inputalias) //cadena verdaderosa o null\
		let can_you_pet_the_dog = utils.mistetas_check(inputalias) 

		if(vibe_check) {
			await interaction.reply({ content: vibe_check, ephemeral: true })
			return
		}
		else if(can_you_pet_the_dog){
			await interaction.reply({ content: can_you_pet_the_dog, ephemeral: true })
			return
		}

		let peli = validate(inputpeli, interaction)
		if(peli == null) return
	
		let sanitized_alias = utils.sanitize_film_name(inputalias)
		if(peli.aliases.includes(sanitized_alias) || peli.sanitized_name == sanitized_alias) {
			interaction.reply({
				content: `Tranqui, ya sé que "${inputalias}" se refiere a ${peli.first_name}.`,
				ephemeral: true
			})
			return
		}

		for(let film of FilmManager.instance.iterate()) {
			if(film.sanitized_name == sanitized_alias) {
				interaction.reply({
					content: `No voy a guardar ese alias. Igual se confunde con ${film.first_name}.`,
					ephemeral: true
				})
				return
			}
		}

		for(let alias_tuple of FilmManager.instance.iterate_aliases()) {
			if(alias_tuple.alias == sanitized_alias) {
				interaction.reply({
					content: `No voy a guardar ese alias porque ya lo usa ${alias_tuple.film.first_name}.`,
					ephemeral: true
				})
				return
			}
		}

		FilmManager.instance.add_alias(peli.sanitized_name, sanitized_alias)
		try {
			await FilmManager.instance.save()
			interaction.reply({
				content: `Añado el alias "${inputalias}" a ${peli.first_name}. A partir de ahora también podéis usar ese nombre para referiros a la peli.`
			})
		} catch(e) {
			console.error(e)
			interaction.reply({
				content: `Ha habido un imprevisto registrando el alias :/`,
				ephemeral: true
			})
		}

	},
};
