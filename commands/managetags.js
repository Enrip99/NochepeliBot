const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Application} = require('discord.js');
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


        let old_channel_id = peli.tag_manager_message["channel_id"]
        let old_message_id = peli.tag_manager_message["message_id"]
        
        if(old_message_id){
            let channel = await interaction.client.channels.fetch(old_channel_id)
            channel.messages.fetch(old_message_id)
                .then(old_message => old_message.edit({ content: "~~" + old_message.content + "~~\n(Deprecado, usa el nuevo mensaje o crea otro con el comando `/managetags`).", components: []}))
                .catch( (e) => {
                    console.log("No se ha podido editar el mensaje con ID " + old_message_id + " en el canal con ID " + old_channel_id + ". Traza: " + e)
                })
        }

        const row = new MessageActionRow()

        for(let tag of FilmManager.instance.iterate_tags()){

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

		let sentmsg = await interaction.reply({ content: "Espera un segundo...", fetchReply: true })
		
        peli.tag_manager_message["channel_id"] = sentmsg.channelId
		peli.tag_manager_message["message_id"] = sentmsg.id

		FilmManager.instance.save().then( () => {
			sentmsg.edit({
                content: "Modificando los tags de la película **" + inputpeli + "**.",
                components: [row]
            })
		}).catch( () => {
			sentmsg.edit("No se ha podido inicializar el manageador :/")
		})

    }

};
