const { MessageActionRow, MessageButton, ApplicationCommand, TextChannel } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require("../src/film_manager.js")
const { Message } = require("../src/message.js")
const DiscordMessage = require("discord.js").Message
const utils = require('../src/utils.js')

const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('1')
						.setLabel('Positivo')
						.setStyle('SUCCESS'),
					new MessageButton()
						.setCustomId('0')
						.setLabel('Neutral')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('-1')
						.setLabel('Negativo')
						.setStyle('DANGER'),
				)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('añade película a la lista')
		.addStringOption(option => 
			option.setName('peli')
				.setDescription('la película a añadir')
				.setRequired(true)),

	/**
	 * 
	 * @param {import("discord.js").CommandInteraction} interaction 
	 * @returns 
	 */
	async execute(interaction) {

		let inputpeli = interaction.options.getString('peli')

		let vibe_check = utils.vaporeon_check(inputpeli) //cadena verdaderosa o null

		if(vibe_check) {
			await interaction.reply({ content: vibe_check, ephemeral: true})
			return
		}
		
		let peli = FilmManager.instance.get(inputpeli)
		if(peli) {

			let old_channel_id = peli.react_message.channel_id
			let old_message_id = peli.react_message.message_id
			if(old_channel_id && old_message_id){
				let channel = await interaction.client.channels.fetch(old_channel_id)
				if(!(channel instanceof TextChannel)) return
				channel.messages.fetch(old_message_id)
					.then(old_message => old_message.edit({ content: `~~${old_message.content}~~\n(Deprecado, usa el nuevo mensaje o crea otro con el comando \`/add\`.)`, components: []}))
					.catch( (e) => {
						console.log(`No se ha podido editar el mensaje con ID ${old_message_id} en el canal con ID ${old_channel_id}. Traza: ${e}`)
					})
			}

			let raw_interaction = await interaction.reply({ content: "Espera un segundo...", fetchReply: true })
			if(!(raw_interaction instanceof DiscordMessage)) return
			let sentmsg = raw_interaction
			peli.react_message = Message.from(sentmsg)
			

			FilmManager.instance.save().then( () => {
				sentmsg.edit({ content: `La película **${pelipost.first_name}** ya estaba en la lista.\nReacciona a este mensaje para añadirte como interesado, no interesado o neutral.`, components: [row]})
			}).catch( () => {
				sentmsg.edit("No se ha podido añadir esa peli :/")
			})
			return
		}

		FilmManager.instance.add(inputpeli, interaction.user.id)
		let pelipost = FilmManager.instance.get(inputpeli)
		let raw_sentmsg = await interaction.reply({ content: "Espera un segundo...", fetchReply: true })
		if(!pelipost || !(raw_sentmsg instanceof DiscordMessage)) return
		let sentmsg = raw_sentmsg
		
		pelipost.react_message = Message.from(sentmsg)
		try {
			await FilmManager.instance.save()
			sentmsg.edit({ content: `**${inputpeli}** añadida a la lista.\nReacciona a este mensaje para añadirte como interesado, no interesado o neutral.`, components: [row] })
		} catch(e) {
			sentmsg.edit("No se ha podido añadir esa peli :/")
		}
	},
};