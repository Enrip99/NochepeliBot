const { MessageActionRow, MessageButton, ApplicationCommand, TextChannel } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require("../src/film_manager.js")
const { Film } = require("../src/film.js")
const { Message } = require("../src/message.js")
const DiscordMessage = require("discord.js").Message
const utils = require('../src/utils.js')
const interests = require('../src/interests.js')
const { DeciduousInteractiveMessage } = require('../src/interactive_message.js');
const { InteractiveMessageManager } = require('../src/interactive_message_manager.js');


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

			let raw_interaction = await interaction.reply({ content: "Espera un segundo...", fetchReply: true })
			if(!(raw_interaction instanceof DiscordMessage)) return
			let sentmsg = raw_interaction
			
			try {
				let interactive_message = new AddInteractiveMessage(sentmsg.channelId, sentmsg.id)
				interactive_message.parse_args(peli.sanitized_name, "true")
				InteractiveMessageManager.instance.add(interactive_message, interaction)
				await FilmManager.instance.save()
			} catch(e) {
				sentmsg.edit("No se ha podido añadir esa peli :/")
			}
			return
		}

		FilmManager.instance.add(inputpeli, interaction.user.id)
		let pelipost = FilmManager.instance.get(inputpeli)
		let raw_sentmsg = await interaction.reply({ content: "Espera un segundo...", fetchReply: true })
		if(!pelipost || !(raw_sentmsg instanceof DiscordMessage)) return
		let sentmsg = raw_sentmsg
		
		try {
			let interactive_message = new AddInteractiveMessage(sentmsg.channelId, sentmsg.id)
			interactive_message.parse_args(peli.sanitized_name, "false")
			InteractiveMessageManager.instance.add(interactive_message, interaction)
			await FilmManager.instance.save()
		} catch(e) {
			sentmsg.edit("No se ha podido añadir esa peli :/")
		}
	},
};


class AddInteractiveMessage extends DeciduousInteractiveMessage {

	/** @type {Film} */
	peli
	/** @type {boolean} */
	film_already_existed


	/**
	 * 
	 * @param {string[]} args 
	 */
	parse_args(...args) {
		this.peli = FilmManager.instance.get(args[0])
		if(1 in args) {
			this.film_already_existed = Boolean(args[1])
		}
	}


	stringify_args() {
		return `${this.peli.sanitized_name}:${this.film_already_existed}`
	}


	buttons_to_create() {
        return [new MessageActionRow()
			.addComponents(
			new MessageButton()
				.setCustomId(`positive`)
				.setLabel('Positivo')
				.setStyle('SUCCESS'),
			new MessageButton()
				.setCustomId(`neutral`)
				.setLabel('Neutral')
				.setStyle('PRIMARY'),
			new MessageButton()
				.setCustomId(`negative`)
				.setLabel('Negativo')
				.setStyle('DANGER'),
		)]
    }


    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     */
    on_add(interaction) {
		let text = ""
		if(!this.film_already_existed) {
			text += `**${this.peli.first_name}** añadida a la lista.`
		}
		else {
			text += `La película **${this.peli.first_name}** ya estaba en la lista.`
		}
		text += `\n¿Qué interés tienes en esta peli?`
        this.edit(interaction.client, text)
		.catch(() => interaction.reply({
			content: `No se ha podido actualizar el mensaje de añadir la peli`,
			ephemeral: true
		}))
    }


    /**
     * 
     * @param {import("discord.js").ButtonInteraction} interaction 
     * @param {string} customId 
     * @param {string[]} args 
     */
    on_update(interaction, customId, args) {
		
        let film = this.peli
		if(!FilmManager.instance.exists(film.sanitized_name)) {
			interaction.reply({
				content: `La peli **${args[0]}** ya no existe. Igual ha cambiado de nombre, o igual ya no está en la lista.`,
				ephemeral: true
			})
			return
		}

		switch(customId) {
			case "positive":
				interests.add_very_interested(film, interaction.user.id)
				.then((updated) => interaction.reply({
					content: updated ?
						`Tu interés en la peli **${film.first_name}** es ahora positivo. Evitaremos verla si no estás.` :
						`Ya estabas muy interesado en la peli **${film.first_name}**.`,
					ephemeral: true
				}))
				.catch(() => interaction.reply({
					content: `No se ha podido guardar tu gran interés en la peli **${film.first_name}** :(. Algo se habrá roto.`,
					ephemeral: true
				}))
				break
			case "neutral":
				interests.remove_interest_for_film(film, interaction.user.id)
				.then((updated) => interaction.reply({
					content: updated ?
						`Tu interés en la peli **${film.first_name}** es ahora neutral, como Suiza.` :
						`No me constaba tu interés o desinterés en **${film.first_name}**.`,
					ephemeral: true
				}))
				.catch(() => interaction.reply({
					content: `No se ha podido guardar tu neutralidad en la peli **${film.first_name}** :(. Algo se habrá roto.`,
					ephemeral: true
				}))
				break
			case "negative":
				interests.add_not_interested(film, interaction.user.id)
				.then((updated) => interaction.reply({
					content: updated ? 
						`Tu interés en la peli **${film.first_name}** es ahora negativo. La veremos sin ti :)` :
						`Ya sé que no quieres ver **${film.first_name}**, pesao.`,
					ephemeral: true
				}))
				.catch(() => interaction.reply({
					content: `No se ha podido guardar tu desinterés en la peli **${film.first_name}** :(. Algo se habrá roto.`,
					ephemeral: true
				}))
				break
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
			for(let row of discord_message.components) {
				for(let component of row.components) {
					component.disabled = true
				}
			}
			discord_message.edit({
				content: `~~${old_message}~~\n(Deprecado, usa el nuevo mensaje o crea otro con el comando \`/add\`.)`,
				components: discord_message.components
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

InteractiveMessageManager.instance.register_type(AddInteractiveMessage)