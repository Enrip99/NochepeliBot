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
				let listmsg = []
				let tosend = ""
				utils.parallel_for(FilmManager.instance.iterate(), async peli => {
					let msg = "\n**" + peli.first_name + "**\n"
					msg += "☑️ " + peli.interested.length + " · ❎ " + peli.not_interested.length
					if(peli.not_interested.length - 3 >= peli.interested.length) {
						msg += " · ratio"
					}
					let user = await utils.get_user_by_id(client, peli.proposed_by_user)
					msg += " · Propuesta por **" + user.username + "**\n"
					listmsg.push(msg)
				})
				.then(() => {
					for(let msg of listmsg) {
						tosend += msg
					}
					message.channel.send(tosend)

				})
			}
		}
	}
};
