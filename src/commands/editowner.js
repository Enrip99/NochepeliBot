const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require("../film_manager.js")
const utils = require('../utils.js');
const { validate } = require('../validate_inputpeli.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('editowner')
		.setDescription('edita la persona que propuso una película')
		.addStringOption(option => 
			option.setName('peli')
				.setDescription('la película a editar')
				.setRequired(true))
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('el nuevo proponedor')
                .setRequired(true)),
	/** 
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(interaction) {

		let inputpeli = interaction.options.getString('peli')
		let inputusuario = interaction.options.getUser('usuario')

		let peli = validate(inputpeli, interaction)
		if(peli == null) return

        peli.proposed_by_user = inputusuario.id 

		FilmManager.instance.save().then( () => {
			interaction.reply(`El nuevo propuestador de la película **${peli.first_name}** ahora es **${inputusuario.username}**. Por favor no uséis esto para decir que he propuesto ver Mistetas.`)
		}).catch( () => {
			interaction.reply({ content: "No se ha podido cambiar el proposicionador de esa peli :/", ephemeral: true })
		})

	},
};

