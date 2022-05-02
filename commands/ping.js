module.exports = {
	name: 'ping',
	description: 'Tiempo de respuesta de bot',
	execute(message, args, client) {
		if (!args.length) {
			//message.channel.send(Date.now() - message.createdTimestamp + ' milisegundos');
			message.channel.send("pong 🏓").then(sent => {
				sent.edit("pong 🏓\n" + (sent.createdTimestamp - message.createdTimestamp) + " milisegundos")
			})
		}
	},
};
