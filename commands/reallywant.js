const config = require('../data/config.json');
const utils = require('../src/utils.js')

module.exports = {
	name: 'reallywant',
	description: 'Te registra como persona particularmente interesada en esta peli. Evitaremos verla si no estás.',
	execute(message, args, client) {
		message.channel.send(message.author.username + " tiene muchas ganas de ver " + utils.parse_film_name(message.content))
        //TODO Este comando está sin terminar
	}
}