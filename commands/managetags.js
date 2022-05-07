const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { FilmManager } = require("../src/film_manager.js")
const { Message } = require("../src/message.js")
const DiscordMessage = require('discord.js').Message

//input: managetags <nombre peli>

module.exports = {
    data: new SlashCommandBuilder()
        .setName('managetags')
        .setDescription('modifica los tags de una película')
        .addStringOption(option => 
            option.setName('peli')
                .setDescription('la película a editar')
                .setRequired(true)),
	/** 
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
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
            .then(old_message => old_message.edit({ content: `~~${old_message.content}~~\n(Deprecado, usa el nuevo mensaje o crea otro con el comando \`/managetags\`).`, components: []}))
            .catch( (e) => {
                console.log(`No se ha podido editar el mensaje con ID ${old_message_obj.message_id} en el canal con ID ${old_message_obj.channel_id}. Traza: ${e}`)
            })
        }
        
        let counter = 0

        
        
        /** @type {MessageActionRow[]} */
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
                            .setLabel(tag.tag_name + (tag.hidden ? " (OCULTO)" : ""))
  
            if(peli.tags.includes(tag)){
                tag_button.setStyle('SUCCESS')
            }
            else{
                tag_button.setStyle('SECONDARY')
            }
  
            row.addComponents(tag_button)
  
        }    
        rows.push(row)
  
		let sentmsg = await interaction.reply({ content: "Espera un segundo...", fetchReply: true })
		
        if(!(sentmsg instanceof DiscordMessage)) return
        peli.tag_manager_message = Message.from(sentmsg)

        try {
            await FilmManager.instance.save()
			sentmsg.edit({
                content: `Modificando los tags de la película **${peli.first_name}**.`,
                components: rows
            })
            
        } catch(e) {
            sentmsg.edit("No se ha podido inicializar el manageador :/")
        }

    }

};
