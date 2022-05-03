const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton} = require('discord.js');
const { FilmManager } = require("../src/film_manager.js")

//input: managetags <nombre peli>

module.exports = {
    data: new SlashCommandBuilder()
        .setName('managetags')
        .setDescription('modifica los tags de una película')
        .addStringOption(option => 
            option.setName('peli')
                .setDescription('la película a editar')
                .setRequired(true)),
	async execute(interaction) {
        
		let inputpeli = interaction.options.getString('peli')

        if(!FilmManager.instance.exists(inputpeli)) {
            await interaction.reply({ content: "La película no está en la lista.", ephemeral: true })
            return
        } 

        peli = FilmManager.instance.get(inputpeli)

        const row = new MessageActionRow()

        for(let tag of FilmManager.instance.iterate_tags()){

            console.log(tag)

            let tag_button = new MessageButton()
                            .setCustomId(tag.sanitized_name)
                            .setLabel(tag.tag_name)

            if(peli.tags.includes(tag.sanitized_name)){
                tag_button.setStyle('SUCCESS')
            }
            else{
                tag_button.setStyle('SECONDARY')
            }

            row.addComponents(tag_button)

        }    

        interaction.reply({
            content: "Modificando los tags de la película " + inputpeli + ".\nTags actuales: " + peli.tags,
            components: [row]
        })

        //TODO: hacer que los botones hagan algo lmao

    }

};
