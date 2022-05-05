const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Tiempo de respuesta del bot'),
	async execute(interaction) {
		interaction.reply({ content: 'pong 🏓', fetchReply: true }).then((sentmsg) => {
			sentmsg.edit(`pong 🏓\n${(sentmsg.createdTimestamp - interaction.createdTimestamp)} milisegundos`)
		});
	},
};
