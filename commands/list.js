const config = require('../data/config.json');
var lista = require('../data/lista.json');
const fs = require('fs');

module.exports = {
	name: 'list',
	description: 'lista todas las pelis',
	execute(message, args, client) {
		if (!args.length) { //muestra solo la lista de películas
			if (!lista.lista.length) message.channel.send("No hay películas en la lista")
			else {
				let tosend = ""
				for (let i = 0; i < lista.lista.length; ++i){
					tosend = tosend + "- **" + lista.lista[i].nombre + "**\n"
				}
				message.channel.send(tosend)
			}
		}
	}
};
