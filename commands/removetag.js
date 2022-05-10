const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Application} = require('discord.js');
const { FilmManager } = require("../src/film_manager.js")
const { InteractiveMessage } = require('../src/interactive_message.js');
const { InteractiveMessageManager } = require('../src/interactive_message_manager.js');
const DiscordMessage = require('discord.js').Message


module.exports = {
	data: new SlashCommandBuilder()
		.setName('removetag')
		.setDescription('quita tag de la lista de tags')
		.addStringOption(option => 
			option.setName('tag')
				.setDescription('el tag a quitar')
				.setRequired(true)),
	/** 
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(interaction) {

		let inputtag = interaction.options.getString('tag')
		let tag = FilmManager.instance.get_tag(inputtag)

		if(!tag) {
			await interaction.reply({ content: `El tag ${inputtag} no existe.`, ephemeral: true})
			return
		}

		let films_with_tag = FilmManager.instance.films_with_tag(inputtag)

        if(films_with_tag.length != 0){      
			
			let pelis_nombradas = films_with_tag.map((peli) => peli.first_name).join(", ")
			let raw_sentmsg = await interaction.reply({ content: `Las siguientes películas tienen el tag **${inputtag}** en uso:\n${pelis_nombradas}.\n¿Seguro que quieres borrarlo?`, fetchReply: true})

			if(!(raw_sentmsg instanceof DiscordMessage)) return
			let sentmsg = raw_sentmsg

			let interactive_message = new RemoveTagInteractiveMessage(sentmsg.channelId, sentmsg.id)
			interactive_message.tag = tag
			InteractiveMessageManager.instance.add(interactive_message, interaction)	
			return            
        }
        
        FilmManager.instance.remove_tag(inputtag)

		FilmManager.instance.save().then( () => {
			interaction.reply(`**${inputtag}** borrado de la lista de tags.`)
		}).catch( () => {
			interaction.reply({ content: `No se ha podido borrar ese tag :/`, ephemeral: true })
		})

	},
};


class RemoveTagInteractiveMessage extends InteractiveMessage {

	/** @type {string} */
	command

	/** @type {import("../src/tag.js").Tag?} */
	tag

    /**
     * 
     * @returns {import("discord.js").MessageActionRow[]}
     */
	 buttons_to_create() {

		return [new MessageActionRow()
					.addComponents(
					new MessageButton()
						.setCustomId(`delete:${this.tag.sanitized_name}`)
						.setLabel('Borrar')
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`cancel:${this.tag.sanitized_name}`)
						.setLabel('Cancelar')
						.setStyle('SECONDARY')
		)]

    }

    
    /**
     * 
     * @param {string[]} args 
     */
    parse_args(...args) {

		this.command = args[0]

		if(args[1]){
			this.tag = FilmManager.instance.get_tag(args[1])
		}

    }


    /**
     * 
     * @param {import("discord.js").ButtonInteraction} interaction
     * @param {string[]} args 
     */
    async on_update(interaction, args) {

		switch(this.command){
			
			case 'cancel':
				interaction.update({ content: `Acción cancelada por el usuario ${interaction.user.username}.`, components: []})
				break
				
			case 'delete':

				if(this.tag){
					FilmManager.instance.remove_tag(this.tag.sanitized_name)
					try {
						await FilmManager.instance.save()
						interaction.update({ content: `El tag **${this.tag.tag_name}** se ha borrado de la lista de tags.`, components: []})
					} catch(e) {
						interaction.update({ content: `No se ha podido borrar el tag **${this.tag.tag_name}** :(`, components: []})
					}
				} else{
					interaction.update({ content: `El tag no se ha podido borrar porque ya no existe.`, components: []})
				}
  
				break

			default:
				console.log('???')
		}
		
    }
}

InteractiveMessageManager.instance.register_type(RemoveTagInteractiveMessage)