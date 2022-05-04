const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { FilmManager } = require("../src/film_manager.js")
const { Message } = require("../src/message.js")

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

        let peli = FilmManager.instance.get(inputpeli)

        let old_message_obj = peli.tag_manager_message
        
        if(old_message_obj) {
            old_message_obj.fetch(interaction.client)
            .then(old_message => old_message.edit({ content: "~~" + old_message.content + "~~\n(Deprecado, usa el nuevo mensaje o crea otro con el comando `/managetags`).", components: []}))
            .catch( (e) => {
                console.log("No se ha podido editar el mensaje con ID " + old_message_id + " en el canal con ID " + old_channel_id + ". Traza: " + e)
            })
        }

        let counter = 0

        const rows = []
        
        let row = new MessageActionRow()

        for(let tag of FilmManager.instance.iterate_tags()){

            counter += 1
            if(counter > 5){
                counter -= 5
                rows.push(row)
                row = new MessageActionRow()
            }

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
        rows.push(row)

		let sentmsg = await interaction.reply({ content: "Espera un segundo...", fetchReply: true })
		
        peli.tag_manager_message = Message.from(sentmsg)

		FilmManager.instance.save().then( () => {
			sentmsg.edit({
                content: "Modificando los tags de la película **" + inputpeli + "**.",
                components: rows
            })
		}).catch( () => {
			sentmsg.edit("No se ha podido inicializar el manageador :/")
		})

    }

};
