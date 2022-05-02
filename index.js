const Discord = require('discord.js');
const fs = require('fs');
const config = require('./data/config.json');
const FilmManager = require('./src/film_manager.js').FilmManager

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', async () => {
  await FilmManager.instance.load(
    on_success = () => {
      console.log('¡Listo!');
      client.user.setActivity('Type AYUDA for help', );
    },
    on_error = () => {
      console.error("No se ha podido cargar la lista")
    }
  );
});

client.on('message', message => {
  if (message.author.bot) return;

  if (message.channel.id != config.channelid) return;

  const args = message.content.trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args, client);
  } catch (error) {
    console.error(error);
  }

});

client.login(config.token);
