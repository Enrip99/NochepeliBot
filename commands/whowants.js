const { FilmManager } = require("../src/film_manager.js")
const utils = require('../src/utils.js')


module.exports = {
	name: 'whowants',
	description: 'Comprueba quien quiere o no ver una película',
	execute(message, args, client) {
		if (!args.length) {
			if(FilmManager.instance.latest_film) {
				check_interests_for_film(message, FilmManager.instance.latest_film, client)
			}
			else {
				message.channel.send("Escribe \"whowants *nombre de la peícula*\" para ver quien quiere ver o no la película.")
			}
		}
		else {
			let inputpeli = utils.parse_film_name(message.content)

			if(!FilmManager.instance.exists(inputpeli)) {
				FilmManager.instance.set_latest_film(null)
				message.channel.send("La película no está en la lista.")
			} else {
				FilmManager.instance.set_latest_film(inputpeli)
				check_interests_for_film(message, inputpeli, client)
			}
		}
	}
};


function check_interests_for_film(message, inputpeli, client) {
	let peli = FilmManager.instance.get(inputpeli)
	let interested_msg = ""
	let not_interested_msg = ""
	let interested_promises = []
	let not_interested_promises = []
	if(peli.interested.length === 0) {
		interested_msg += "No hay nadie particularmente interesado en ver **" + peli.first_name + "**."
	}
	else {
		interested_msg += "Gente interesada en ver **" + peli.first_name + "**:"
		for (let user of peli.interested) {
			interested_promises.push(utils.get_user_by_id(client, user))
		}
	}
	if (peli.not_interested.length === 0) {
		not_interested_msg += "No hay nadie que no quiera ver **" + inputpeli + "**."
	}
	else {
		not_interested_msg += "Gente sin interés en ver **" + inputpeli + "**:"
		for (let user of peli.not_interested){
			not_interested_promises.push(utils.get_user_by_id(client, user))
		}
	}
	Promise.all(interested_promises).then(values => {
		for (let value of values) {
			interested_msg += "\n- **" + value.username + "**"
		}
		message.channel.send(interested_msg)
	})

	Promise.all(not_interested_promises).then(values => {
		for (let value of values) {
			not_interested_msg += "\n- **" + value.username + "**"
		}
		message.channel.send(not_interested_msg)
	})
}
