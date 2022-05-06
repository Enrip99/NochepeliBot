const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordMessage = require("discord.js").Message

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Tiempo de respuesta del bot'),
	/** 
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(interaction) {
		interaction.reply({ content: 'pong 🏓', fetchReply: true }).then((sentmsg) => {
			if(!(sentmsg instanceof DiscordMessage)) return
			sentmsg.edit("pong 🏓\n" + (sentmsg.createdTimestamp - interaction.createdTimestamp) + " milisegundos")
		});
	},
};
