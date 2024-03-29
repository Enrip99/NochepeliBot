// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, GatewayIntentBits, Partials, ChannelType } = require('discord.js');
const { token, guildId, channelId } = require('../data/config.json');
const { FilmManager } = require('./film_manager.js')
const { Message } = require('./message.js')
const { Film } = require('./film.js')
const utils = require('./utils.js')
const interests = require('./interests.js');
const { InteractiveMessageManager } = require('./interactive_message_manager');
const { get_command_collection } = require('./commands');
const DiscordMessage = require("discord.js").Message


// Create a new client instance
/** @type {import('discord.js').Client} */
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions] });

const commands = get_command_collection()

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
          if(!(channel.type === ChannelType.GuildText)) return
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

	const command = commands[interaction.commandName];

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
