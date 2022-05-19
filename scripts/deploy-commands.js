const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../data/config.json');
const { get_all_nested_files } = require("./script-utils.js")
const process = require('process')
const path = require('path')

const COMMANDS_DIR = "src/commands"

const commands = [];

const rest = new REST({ version: '9' }).setToken(token);

const commandFiles = get_all_nested_files(COMMANDS_DIR)

for (const file of commandFiles) {
	const command = require(`../${file}`); // Partiendo del directorio raíz del proyecto
	commands.push(command.data.toJSON());
}


let rest_target = Routes.applicationCommands(clientId)
if(process.argv.includes("global")) {
	console.log("Se van a modificar los comandos globales.")
	rest_target = Routes.applicationGuildCommands(clientId, guildId)
}

if(process.argv.includes("delete")) {
	rest.get(rest_target)
	.then(data => {
		console.log("Borrando comandos de Discord...")
		/** @type {Promise<any>[]} */
		let promises = []
		// @ts-ignore
		for(let command of data) {
			promises.push(rest.delete(`${rest_target}/${command.id}`))
		}
		return Promise.all(promises)
	})
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
}
else {
	console.log("Añadiendo comandos a Discord...")
	rest.put(rest_target, { body: commands })
	.then(() => console.log('Se han registrado los comandos.'))
	.catch(e => {
		console.error(e)	
		process.exit(1)
	})
}