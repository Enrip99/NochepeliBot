const { FilmManager } = require('../src/film_manager.js');
const utils = require('../src/utils.js');

module.exports = {
	name: 'list',
	description: 'lista todas las pelis',
	execute(message, args, client) {
		if (!args.length) { //muestra solo la lista de películas
			if (!FilmManager.instance.count()) {
				message.channel.send("No hay películas en la lista")
			} else {
				FilmManager.instance.set_latest_film(null)
				let listmsgs = []
				let listprom = []
				let tosend = ""
				for (let peli of FilmManager.instance.iterate()) {
					listmsgs.push("\n- **" + peli.first_name + "** (" + peli.interested.length + ") - Propuesta por: **")
					listprom.push(utils.get_user_by_id(client, peli.proposed_by_user))
				}

				Promise.all(listprom).then(values => {
					for (let j = 0; j < values.length; ++j){
						tosend += listmsgs[j] += values[j].username + "**"
					}
				message.channel.send(tosend)
				})
			}
		}
	}
};
