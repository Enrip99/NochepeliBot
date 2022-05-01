module.exports = {
	name: 'aydua',
	description: 'help',
	execute(message, args, client) {
		message.channel.send("Escribe **list** para ver la lista de películas.\nEscribe **add** ***nombre de la peli*** para añadirla a la lista.\nEscribe **remove** ***nombre de la peli*** para quitarla de la lista.")
	},
};
