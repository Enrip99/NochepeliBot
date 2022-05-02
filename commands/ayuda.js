module.exports = {
	name: 'ayuda',
	description: 'help',
	execute(message, args, client) {
		let msg = "Escribe **list** para ver la lista de películas.\n"
		msg += "Escribe **add** ***nombre de la peli*** para añadirla a la lista.\n"
		msg += "Escribe **remove** ***nombre de la peli*** para quitarla de la lista.\n"
		msg += "Escribe **getlink** ***nombre de la peli*** para obtener el enlace de la película.\n"
		msg += "Escribe **addlink** ***nombre de la peli*** **enlace** para añadir o modificar un enlace a una película.\n"
		msg += "Escribe **removelink** ***nombre de la peli*** para quitar el enlace de una película.\n"

		message.channel.send(msg)
	},
};
