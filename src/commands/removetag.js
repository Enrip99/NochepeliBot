const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const { FilmManager } = require("../film_manager.js")
const { InteractiveMessage } = require('../interactive_message.js');
const { InteractiveMessageManager } = require('../interactive_message_manager.js');
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

		/** 
		 * @type {string}
		 * @ts-ignore */
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

	/** @type {import("../tag.js").Tag?} */
	tag

    /**
     * 
     * @returns {ActionRowBuilder<ButtonBuilder>[]}
     */
	 buttons_to_create() {
		/** 
		 * @type {ActionRowBuilder<ButtonBuilder>[]}
		 * @ts-ignore */	
		let action_rows = [new ActionRowBuilder()
					.addComponents(
					new ButtonBuilder()
						.setCustomId(`delete:${this.tag.sanitized_name}`)
						.setLabel('Borrar')
						.setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
						.setCustomId(`cancel:${this.tag.sanitized_name}`)
						.setLabel('Cancelar')
						.setStyle(ButtonStyle.Secondary)
		)]
		return action_rows
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