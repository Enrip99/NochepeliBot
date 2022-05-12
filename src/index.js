// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, guildId, channelId } = require('../data/config.json');
const { FilmManager } = require('./film_manager.js')
const { Message } = require('./message.js')
const { Film } = require('./film.js')
const utils = require('./utils.js')
const interests = require('./interests.js');
const { MessageActionRow, MessageButton, TextChannel } = require('discord.js');
const { InteractiveMessageManager } = require('./interactive_message_manager');
const DiscordMessage = require("discord.js").Message


// Create a new client instance
/** @type {import('discord.js').Client} */
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', async () => {
  try {
    FilmManager.instance.client = client
    InteractiveMessageManager.instance.register(client)
    await FilmManager.instance.load()
    client.user.setActivity('Type AYUDA for help', );

    client.channels.fetch(channelId).then(channel => {
      console.log("Cargando en caché mensajes de reacción:")
      /** @type {Promise<Film>[]} */
      let promarray = []
      for (let peli of FilmManager.instance.iterate()){
        console.log(`Loaded ${peli.first_name}`)
        // promarray.push(peli.react_message["channel_id"].messages.fetch(peli.react_message["message_id"], true))
      }
      Promise.all(promarray).then( value => {
        console.log('¡Listo!');
        client.channels.fetch(channelId).then(channel => {
          if(!(channel instanceof TextChannel)) return
          channel.send('°･*: ．。．☆ Holi 。 ☆ ．。．:*･°')});
      })
    })
  } catch(e) {
    console.error("No se ha podido cargar la lista")
  }
})


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
  if (interaction.guildId != guildId) return

	const command = commands.get(interaction.commandName);

	if (!command) return;

	try {
    await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Algo ha fallao, mi pana', ephemeral: true });
	}
});


// Login to Discord with your client's token
client.login(token);


for(let p of ["SIGQUIT", "SIGINT", "SIGTERM", "SIGBREAK", "SIGHUP", "exit"]) {
  process.on(p, () => utils.shut_down(client))
}
