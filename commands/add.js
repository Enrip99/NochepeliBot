const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require("../src/film_manager.js")
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
	async execute(interaction) {

		let inputpeli = interaction.options.getString('peli')

		vibe_check = utils.vaporeon_check(inputpeli) //cadena verdaderosa o false

		if(vibe_check) {
			await interaction.reply({ content: vibe_check, ephemeral: true})
			return
		}
		
		if(FilmManager.instance.exists(inputpeli)) {
			let pelipost = FilmManager.instance.get(inputpeli)

			let old_channel_id = pelipost.react_message['channel_id']
			let old_message_id = pelipost.react_message['message_id']
			if(old_channel_id && old_message_id){
				let channel = await interaction.client.channels.fetch(old_channel_id)
				channel.messages.fetch(old_message_id)
					.then(old_message => old_message.edit({ content: "~~" + old_message.content + "~~\n(Deprecado, usa el nuevo mensaje o crea otro con el comando `/add`.)", components: []}))
					.catch( (e) => {
						console.log("No se ha podido editar el mensaje con ID " + old_message_id + " en el canal con ID " + old_channel_id + ". Traza: " + e)
					})
			}

			let sentmsg = await interaction.reply({ content: "Espera un segundo...", fetchReply: true })
			
			pelipost.react_message['channel_id'] = sentmsg.channelId
			pelipost.react_message['message_id'] = sentmsg.id
			

			FilmManager.instance.save().then( () => {
				sentmsg.edit({ content: "La película **" + pelipost.first_name + "** ya estaba en la lista.\nReacciona a este mensaje para añadirte como interesado, no interesado o neutral.", components: [row]})
			}).catch( () => {
				sentmsg.edit("No se ha podido añadir esa peli :/")
			})
			return
		}

		FilmManager.instance.add(inputpeli, interaction.user.id)
		FilmManager.instance.set_latest_film(inputpeli)
		let pelipost = FilmManager.instance.get(inputpeli)

		let sentmsg = await interaction.reply({ content: "Espera un segundo...", fetchReply: true })
		
		pelipost.react_message['channel_id'] = sentmsg.channelId
		pelipost.react_message['message_id'] = sentmsg.id
		FilmManager.instance.save().then( () => {
			sentmsg.edit({ content: "**" + inputpeli + "** añadida a la lista.\nReacciona a este mensaje para añadirte como interesado, no interesado o neutral.", components: [row] })
		}).catch( () => {
			sentmsg.edit("No se ha podido añadir esa peli :/")
		})

	},
};

