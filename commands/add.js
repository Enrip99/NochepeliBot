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
			if(vaporeon_check(message)) {
				FilmManager.instance.set_latest_film(null)
				return
			}
			let inputpeli = utils.parse_film_name(message.content)
			if(FilmManager.instance.exists(inputpeli)) {
				message.channel.send("Esa película ya está en la lista.")
				FilmManager.instance.set_latest_film(inputpeli)
			}
			else {
				FilmManager.instance.add(inputpeli, message.author.id)
				FilmManager.instance.set_latest_film(inputpeli)
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
						FilmManager.instance.set_latest_film(null)
						message.channel.send("No se ha podido añadir esa peli :/")
					})

					*/
			}
		}
	}
};


function vaporeon_check(message) {
	let regex = /\bvaporeon\b/gmi
	let ret = false
	if(message.content.match(regex)) {
		message.channel.send(utils.random_from_list(
			["jaja qué gracioso", "comedy heaven", "me parto los cojones /s", "la comedia fue hecha",
			"Hey guys, did you know that in terms of human companionship, Flareon is objectively the most huggable Pokemon? While their maximum temperature is likely too much for most, they are capable of controlling it, so they can set themselves to the perfect temperature for you. Along with that, they have a lot of fluff, making them undeniably incredibly soft to touch. But that's not all, they have a very respectable special defense stat of 110, which means that they are likely very calm and resistant to emotional damage. Because of this, if you have a bad day, you can vent to it while hugging it, and it won't mind. It can make itself even more endearing with moves like Charm and Baby Doll Eyes, ensuring that you never have a prolonged bout of depression ever again.",
			"lol", "ok"]))
		ret = true
	}
	return ret
}
