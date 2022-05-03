const Discord = require('discord.js');
const fs = require('fs');
const config = require('./data/config.json');
const FilmManager = require('./src/film_manager.js').FilmManager
const utils = require('./src/utils.js')
const interest = require('./src/interest.js')

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
      client.user.setActivity('Type AYUDA for help', );

      client.channels.fetch(config.channelid).then(channel => {
        console.log("Cargando en caché mensajes de reacción:")
        let promarray = []
        for (let peli of FilmManager.instance.iterate()){
          console.log(peli.react_message + " - " + peli.first_name)
          promarray.push(channel.messages.fetch(peli.react_message, true))
        }
        Promise.all(promarray).then( value => {
          console.log('¡Listo!');
          client.channels.fetch(config.channelid).then(channel => channel.send('°･*: ．。．☆ Holi 。 ☆ ．。．:*･°'));
        })
      })


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

client.on('messageReactionAdd', async (reaction, author) => {
  if (reaction.message.channel.id != config.channelid || author.bot) {
    return;
  }
  else {
    let user = author.id
    for (let peli of FilmManager.instance.iterate()){
      if (reaction.message.id == peli.react_message){
        switch (reaction.emoji.name) {
          case '🤷': //:shrug, neutralwant
            interest.remove_interest_for_film(reaction.message, peli.first_name, author)
            break;
          case '☑️': //:tick, reallywant
            interest.add_very_interested(reaction.message, peli.first_name, author)
            break;
          case '❎': //:cruz, dontwant
            interest.add_not_interested(reaction.message, peli.first_name, author)
            break;
          default:
        }
      }
    }
  }
});


client.login(config.token);


for(let p of ["SIGQUIT", "SIGINT", "SIGTERM", "SIGBREAK", "SIGHUP", "exit"]) {
  process.on(p, () => utils.shut_down(client))
}