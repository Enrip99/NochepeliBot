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
		not_interested_msg += "\nNo hay nadie que no quiera ver **" + peli.first_name + "**."
	}
	else {
		not_interested_msg += "\nGente sin interés en ver **" + peli.first_name + "**:"
		for (let user of peli.not_interested){
			interested_promises.push(utils.get_user_by_id(client, user))
		}
	}
	let i = 0;
	Promise.all(interested_promises).then(values => {
		for (let value of values) {
			if (i == peli.interested.length) interested_msg += not_interested_msg
			++i
			interested_msg += "\n- **" + value.username + "**"
		}
		if (peli.not_interested.length == 0) interested_msg += not_interested_msg
		message.channel.send(interested_msg)
	})
}
