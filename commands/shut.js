const config = require('../data/config.json');
const utils = require('../src/utils.js')

module.exports = {
	name: 'shut',
	description: 'kills bot',
	execute(message, args, client) {
		if (args.length === 1 && (args[0].toLowerCase() === "off" || args[0].toLowerCase() === "down")) {

			if(config.owners.includes(message.author.id)) {
				utils.shut_down(client)
			}
			else {
				message.channel.send('Solo puedo apagarme por orden de los propietarios del bot.')
			}

		} else if (args.length === 0) {
			message.channel.send('https://i.redd.it/dwq88d3nnj141.png')
		}
	}
}
