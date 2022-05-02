const Discord = require('discord.js');
const fs = require('fs');
const config = require('./data/config.json');
const FilmManager = require('./src/film_manager.js').FilmManager
const utils = require('./src/utils.js')

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
  if (reaction.message.channel.id != config.channelid) {
    return;
  }
  else {
    let user = author.id
    for (let peli of FilmManager.instance.iterate()){
      if (reaction.message.id == peli.react_message){
        if(peli.interested.includes(user)) {
					reaction.message.channel.send("<@" + user + ">, ya estás puesto como muy interesado en **" + peli.first_name + "**.")
        }
        else {
					peli.interested.push(user)
					let msg = "<@" + user + ">, has sido añadido a la lista de muy interesados en **" + peli.first_name + "**."
					if(utils.remove_from_list(peli.not_interested, user)) {
						msg += " También has sido eliminado de la lista de no interesados."
					}
          FilmManager.instance.save(
						on_success = () => {
							reaction.message.channel.send(msg)
						},
						on_error = () => {
							reaction.message.channel.send("Ha habido algún problema para actualizar tu interés en esta peli :/")
						}
					)
        }
      }
    }
  }
});

client.login(config.token);
