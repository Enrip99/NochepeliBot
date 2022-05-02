const { FilmManager } = require('../src/film_manager.js');

module.exports = {
	name: 'list',
	description: 'lista todas las pelis',
	execute(message, args, client) {
		if (!args.length) { //muestra solo la lista de películas
			if (!FilmManager.instance.count()) {
				message.channel.send("No hay películas en la lista")
			} else {
				let tosend = ""
				for(let peli of FilmManager.instance.iterate()) {
					tosend = tosend + "- **" + peli.first_name + "**\n"
				}
			}
		}
	}
};
