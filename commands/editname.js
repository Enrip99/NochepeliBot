const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require("../src/film_manager.js")
const utils = require('../src/utils.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('editname')
		.setDescription('edita el nombre de una película')
		.addStringOption(option => 
			option.setName('peli')
				.setDescription('la película a editar')
				.setRequired(true))
        .addStringOption(option => 
            option.setName('nombre')
                .setDescription('el nuevo nombre')
                .setRequired(true)),
	async execute(interaction) {

		let inputpeli = interaction.options.getString('peli')
		let inputnombre = interaction.options.getString('nombre')

		vibe_check = utils.vaporeon_check(inputnombre) //cadena verdaderosa o false

		if(vibe_check) {
			await interaction.reply({ content: vibe_check, ephemeral: true})
			return
		}

        if(!FilmManager.instance.exists(inputpeli)){
            await interaction.reply({ content: "La película **" + inputpeli + "** no está en la lista.", ephemeral: true})
			return
        }

        if(FilmManager.instance.exists(inputnombre)){
            let peli = FilmManager.instance.get(inputnombre)
            await interaction.reply({ content: "Ya hay una película con el nombre **" + peli.first_name + "** en la lista.", ephemeral: true})
			return
        }
		
		let peli = FilmManager.instance.get(inputpeli)
        let deadname = peli.first_name

        FilmManager.instance.edit_name(inputpeli, inputnombre)        

		FilmManager.instance.save().then( () => {
			interaction.reply("La película **" + deadname + "** ahora se llama **" + inputnombre + "**. No le hagas deadname :(.")
		}).catch( () => {
			interaction.reply({ content: "No se ha podido cambiar el nombre de esa peli :/", ephemeral: true })
		})

	},
};

