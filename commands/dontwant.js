const config = require('../data/config.json');
const utils = require('../utils.js')

module.exports = {
	name: 'dontwant',
	description: 'Te registra como persona no interesada en la peli que digas. La veremos sin ti :)',
	execute(message, args, client) {
		message.channel.send(message.author.username + " no quiere ver " + utils.parse_movie_name(message.content))

        //TODO Este comando está sin terminar
	}
}