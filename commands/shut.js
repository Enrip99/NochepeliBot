const config = require('../data/config.json');

module.exports = {
	name: 'shut',
	description: 'kills bot',
	execute(message, args, client) {
		if (args.length === 1 && args[0] === "off") {
			if (message.author.id === config.owner1 || message.author.id === config.owner2){
				console.log('Apagando...');
				process.exit();
			}
			else {
				message.channel.send('Solo puedo apagarme por orden de los propietarios del bot.')
			}
		}
	}
}
