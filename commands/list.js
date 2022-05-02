const { FilmManager } = require('../src/film_manager.js');

module.exports = {
	name: 'list',
	description: 'lista todas las pelis',
	execute(message, args, client) {
		if (!args.length) { //muestra solo la lista de películas
			if (!lista.lista.length) message.channel.send("No hay películas en la lista")
			else {
				let listmsgs = []
				let listprom = []
				let tosend = ""
				for (let i = 0; i < lista.lista.length; ++i){
					listmsgs.push("\n- **" + lista.lista[i].nombre + "** (" + lista.lista[i].interesados.length + ") - Propuesta por: **")
					listprom.push(client.users.fetch(String(lista.lista[i].propuesto)))
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
