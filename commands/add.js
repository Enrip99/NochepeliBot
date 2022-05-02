const fs = require('fs');
const { FilmManager } = require("../src/film_manager.js")
const utils = require('../src/utils.js')


module.exports = {
	name: 'add',
	description: 'añade película a la lista',
	execute(message, args, client) {
		if (!args.length) {
			message.channel.send("Escribe \"add *nombre de la peícula*\" para añadirla a la lista.")
		}
		else {
			let inputpeli = utils.parse_film_name(message.content)
			if(FilmManager.instance.exists(inputpeli)) {
				message.channel.send("Esa película ya está en la lista.")
			}
			else {
				FilmManager.instance.add(inputpeli, message.author.id)
				let pelipost = FilmManager.instance.get(inputpeli)

				message.channel.send("Espera un segundo...").then(sentmsg => {
					pelipost.react_message = sentmsg.id
					FilmManager.instance.save(on_success = () => {
						sentmsg.edit("**" + inputpeli + "** añadida a la lista.\nReacciona a este mensaje para añadirte como interesado.")
					},
					on_error = () => {
						sentmsg.edit("No se ha podido añadir esa peli :/")
					})
				})

				/*
				FilmManager.instance.save(
					on_success = () => {
						message.channel.send("**" + inputpeli + "** añadida a la lista.").then(sentmsg => {
							console.log(sentmsg)
							let pelipost = FilmManager.instance.get(inputpeli)
							pelipost.react_message = sentmsg.id
							FilmManager.instance.save()
							sentmsg.edit(sentmsg.content + "\nReacciona a este mensaje para añadirte como interesado.")
						})
					},
					on_error = () => {
						message.channel.send("No se ha podido añadir esa peli :/")
					})

					*/
			}
		}
	}
};
