const { FilmManager } = require("../src/film_manager.js")

//input: addlink <nombre peli> <link> 

module.exports = {
	name: 'addlink',
	description: 'añade o modifica el enlace de una película de la lista',
	execute(message, args, client) {
		if (args.length < 2) {
			message.channel.send("Escribe \"addlink *nombre de la peícula* *enlace*\" para añadir el enlace a la película.")
		}
		else {
			let inputlink = args[args.length-1]
			if(!inputlink.includes("://")) {
				FilmManager.instance.set_latest_film(null)
				message.channel.send("No veo el link :eyes:")
				return
			}
			let inputpeli = message.content.split(' ')
			inputpeli.shift()
			inputpeli.pop()
			inputpeli = inputpeli.join(' ')

			if(!FilmManager.instance.exists(inputpeli)) {
				FilmManager.instance.set_latest_film(null)
				message.channel.send("La película no está en la lista.")
			} else {
				let peli = FilmManager.instance.get(inputpeli)
				let actualizar = peli.link != null
				FilmManager.instance.set_latest_film(inputpeli)
				peli.link = inputlink
				console.log("Actualizado link para peli " + inputpeli)

				FilmManager.instance.save(
					on_success = () => {
						if(actualizar) {
							message.channel.send("Enlace actualizado para la peli **" + inputpeli +  "**.")
						} else {
							message.channel.send("Enlace añadido a la peli **" + inputpeli +  "**.")
						}
					},
					on_error = () => {
						message.channel.send("No se ha podido poner ese enlace a la peli.")
					}
				)
			}
		}
	}
};
