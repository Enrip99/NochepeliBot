const config = require('../data/config.json');

module.exports = {
	name: 'shut',
	description: 'kills bot',
	execute(message, args, client) {
		if (args.length === 1 && args[0] === "off") {

			for (var i = 0; i < config.owners.length; ++i){
				if (message.author.id === config.owners[i]){
					console.log('Apagando...');
					process.exit();
				}
			}
			message.channel.send('Solo puedo apagarme por orden de los propietarios del bot.')
		}
	}
}