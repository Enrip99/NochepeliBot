const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { FilmManager } = require('../film_manager.js');
const { InteractiveMessage } = require('../interactive_message.js');
const { InteractiveMessageManager } = require('../interactive_message_manager.js');
const DiscordMessage = require('discord.js').Message

const FILMS_PER_PAGE = 10

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('lista todas las pelis por páginas')
		.addStringOption(option => 
			option.setName('tag')
				.setDescription('el tag por el que filtrar')
				.setRequired(false)),
	/** 
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(interaction) {

		let inputtag = interaction.options.getString('tag')
		let tag = inputtag ? FilmManager.instance.get_tag(inputtag) : null
		let iterable = tag ? FilmManager.instance.films_with_tag(inputtag) : null


		if ( inputtag && !tag ) { //si el tag no existe
			interaction.reply({ content: `El tag **${inputtag}** no existe :(`, ephemeral: true })
			return
		}
	
		if (!FilmManager.instance.count() || (tag && !iterable.length)) {
			interaction.reply({ content: "No hay películas en la lista", ephemeral: true })
			return
		}

		let raw_sentmsg = await interaction.reply({ content: "Espera un segundo", fetchReply: true})
		if(!(raw_sentmsg instanceof DiscordMessage)) return
		let sentmsg = raw_sentmsg


		let interactive_message = new ListInteractiveMessage(sentmsg.channelId, sentmsg.id)
		interactive_message.parse_args("", tag ? tag.sanitized_name : "", "0")
		InteractiveMessageManager.instance.add(interactive_message, interaction)			
	}
}


class ListInteractiveMessage extends InteractiveMessage {

	/** @type {import("../tag.js").Tag?} */
	tag
	/** @type {number} */
	page

    /**
     * 
     * @returns {import("discord.js").MessageActionRow[]}
     */
	 buttons_to_create() {
        return [new MessageActionRow()
					.addComponents(
					new MessageButton()
						.setCustomId(`left:${this.tag ? this.tag.sanitized_name : ''}:${this.page}`)
						.setEmoji('⬅️')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`right:${this.tag ? this.tag.sanitized_name : ''}:${this.page}`)
						.setEmoji('➡️')
						.setStyle('PRIMARY')
		)]
    }

    
    /**
     * 
     * @param {string[]} args 
     */
    parse_args(...args) {
		if(args[1] === "") {
			this.tag = null
		} else {
			this.tag = FilmManager.instance.get_tag(args[1])
		}
		this.page = parseInt(args[2])
    }


    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     */
    async on_add(interaction) {
        let render_data = await FilmManager.instance.list_renderer.create_single_page_embed(this.page, FILMS_PER_PAGE, 
			(this.tag ? peli => peli.tags.includes(this.tag) : peli => true),
			undefined,
			(this.tag ? this.tag.hidden : false),
			(this.tag ? this.tag.tag_name : undefined))
		let old_message = await this.fetch(interaction.client)
		let embed = await render_data.embed

		old_message.edit({ content: null, embeds: [embed] })
    }


    /**
     * 
     * @param {import("discord.js").ButtonInteraction} interaction
     * @param {string[]} args 
     */
    async on_update(interaction, args) {

		switch(args[0]) {
			case "left":
				this.page -= 1
				break
			case "right":
				this.page += 1
				break
		}

        let render_data = await FilmManager.instance.list_renderer.create_single_page_embed(this.page, FILMS_PER_PAGE, 
			(this.tag ? peli => peli.tags.includes(this.tag) : peli => true),
			undefined,
			(this.tag ? this.tag.hidden : false),
			(this.tag ? this.tag.tag_name : undefined))
		this.page = render_data.page_number
		let rows = this.create_buttons()
		let embed = await render_data.embed

		interaction.update({ embeds: [embed], components: rows })
    }
}

InteractiveMessageManager.instance.register_type(ListInteractiveMessage)