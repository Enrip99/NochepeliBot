const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } = require('discord.js');
const { FilmManager } = require("../film_manager.js")
const { Film } = require("../film.js")
const utils = require('../utils.js')
const { DeciduousInteractiveMessage } = require('../interactive_message.js');
const { InteractiveMessageManager } = require('../interactive_message_manager.js');
const { validate } = require('../validate_inputpeli.js');

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
        
		/** 
		 * @type {string}
		 * @ts-ignore */
		let inputpeli = interaction.options.getString('peli')

        let peli = validate(inputpeli, interaction)
        if(peli == null) return
          
		let sentmsg = await interaction.reply({ content: "Espera un segundo...", fetchReply: true })
		
        if(!(sentmsg instanceof Message)) return

		try {
			let interactive_message = new ManageTagsInteractiveMessage(sentmsg.channelId, sentmsg.id)
			interactive_message.parse_args(peli.sanitized_name)
			InteractiveMessageManager.instance.add(interactive_message, interaction)
			await FilmManager.instance.save()
		} catch(e) {
			sentmsg.edit("No se ha podido inicializar el manageador :/")
		}

    }

};


// for (let peli of FilmManager.instance.iterate()){

//     if(peli.tag_manager_message && peli.tag_manager_message.equals(interaction_msg)){

//       interaction.deferUpdate()

      
//     }
//   }


class ManageTagsInteractiveMessage extends DeciduousInteractiveMessage {

	/** @type {Film} */
	peli


	/**
	 * 
	 * @param {string[]} args 
	 */
	parse_args(...args) {
		this.peli = FilmManager.instance.get(args[0])
	}


	stringify_args() {
		return `${this.peli.sanitized_name}`
	}


	buttons_to_create() {

		/** @type {ActionRowBuilder<ButtonBuilder>[]} */
        const rows = []
		/** @type {ActionRowBuilder<ButtonBuilder>} */
        let row = new ActionRowBuilder()
        let counter = 0
        
        for(let tag of FilmManager.instance.iterate_tags()){
            
            counter += 1
            if(counter > 5){
                counter -= 5
                rows.push(row)
                row = new ActionRowBuilder()
            }

            let tag_button = new ButtonBuilder()
                            .setCustomId(tag.sanitized_name)
                            .setLabel(tag.tag_name + (tag.hidden ? " (OCULTO)" : ""))

            if(this.peli.tags.includes(tag)){
                tag_button.setStyle(ButtonStyle.Success)
            }
            else{
                tag_button.setStyle(ButtonStyle.Secondary)
            }

            row.addComponents(tag_button)
        }
        rows.push(row)

        return rows
    }


    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     */
    on_add(interaction) {

        let text = `Modificando los tags de la película **${this.peli.first_name}**.`
        this.edit(interaction.client, text)
        
    }


    /**
     * 
     * @param {import("discord.js").ButtonInteraction} interaction
     * @param {string[]} args 
     */
    async on_update(interaction, args) {

        let film = this.peli
		if(!FilmManager.instance.exists(film.sanitized_name)) {
			interaction.reply({
				content: `La peli ya no existe. Igual ha cambiado de nombre, o igual ya no está en la lista.`,
				ephemeral: true
			})
			return
		}

        let tag = FilmManager.instance.get_tag(args[0])

        if(film.tags.includes(tag)){
            utils.remove_from_list(film.tags, tag)
        } else if(tag){ //tag != null
            film.tags.push(tag)
        }

		/** 
		 * @type {ActionRowBuilder<ButtonBuilder>[]}
		 * @ts-ignore */
        let rows = this.create_buttons()

        try {
            await FilmManager.instance.save()
            interaction.update({ components: rows })
        } catch(e) {
            console.error(e)
        }

    }

	identity() {
        return this.peli ? this.peli.sanitized_name : this.toString()
    }

    /**
     * 
     * @param {import("discord.js").Interaction} interaction 
     */
    on_abandon(interaction) {
		this.fetch(interaction.client)
		.then(discord_message => {
			let old_message = discord_message.content
			let old_components = discord_message.components
			/** @type {ActionRowBuilder<ButtonBuilder>[]} */
			let new_components = []
			for(let row of old_components){
				/** 
				 * @type {ActionRowBuilder<ButtonBuilder>}
				 * @ts-ignore */
				let new_row = ActionRowBuilder.from(row)
				new_row.components.forEach(
					receivedButton => {
						let editedButton = ButtonBuilder.from(receivedButton).setDisabled(true)
						receivedButton = editedButton
					}
				)
				new_components.push(new_row)
			}
			discord_message.edit({
				content: `~~${old_message}~~\n(Deprecado, usa el nuevo mensaje o crea otro con el comando \`/managetags\`.)`,
				components: new_components
			})
		})
		.catch((e) => {
			console.log(`No se ha podido editar el mensaje ${this}. Traza: ${e}`)
		})
    }


	should_be_kept() {
		return this.peli != null && FilmManager.instance.exists(this.peli.sanitized_name)
	}
}

InteractiveMessageManager.instance.register_type(ManageTagsInteractiveMessage)