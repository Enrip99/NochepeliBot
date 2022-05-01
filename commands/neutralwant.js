const config = require('../data/config.json');
var lista = require('../data/lista.json');
const utils = require('../utils.js')
const fs = require('fs');

module.exports = {
	name: 'neutralwant',
	description: 'Deshace el haber indicado si una película te interesa particularmente o no te interesa.',
	execute(message, args, client) {
		message.channel.send(message.author.username + " le da igual ver " + utils.parse_movie_name(message.content))

        //TODO Este comando está sin terminar
	}
}
