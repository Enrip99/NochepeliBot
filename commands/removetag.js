const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Application} = require('discord.js');
const { Film } = require('../src/film.js');
const { FilmManager } = require("../src/film_manager.js")
const utils = require('../src/utils.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removetag')
		.setDescription('quita tag de la lista de tags')
		.addStringOption(option => 
			option.setName('tag')
				.setDescription('el tag a quitar')
				.setRequired(true)),
	async execute(interaction) {

		let inputtag = interaction.options.getString('tag')

		if(!FilmManager.instance.exists_tag(inputtag)) {
			await interaction.reply({ content: "El tag " + inputtag + " no existe.", ephemeral: true})
			return
		}
		
        let films_with_tag = FilmManager.instance.films_with_tag(inputtag)

        if(films_with_tag.length != 0){            
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('delete tag ' + inputtag)
                        .setLabel('Borrar')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('cancel')
                        .setLabel('Cancelar')
                        .setStyle('SECONDARY')
                )
            
            //TODO: pasar esto a utils o a FilmManager y formatear como string de modo bonito
            let pelis_nombradas = films_with_tag.map((peli) => peli.first_name)

            interaction.reply({ content: "Las siguientes películas tienen el tag **" + inputtag + "** en uso:\n" + pelis_nombradas + ".\n¿Seguro que quieres borrarlo?", components: [row]})
            
            return
        }
        
        FilmManager.instance.remove_tag(inputtag)

		FilmManager.instance.save().then( () => {
			interaction.reply("**" + inputtag + "** borrado de la lista de tags.")
		}).catch( () => {
			interaction.reply({ contents: "No se ha podido borrar ese tag :/", ephemeral: true })
		})

	},
};

