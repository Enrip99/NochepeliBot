// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { owners, token, channelid } = require('./data/config.json');
const FilmManager = require('./src/film_manager.js').FilmManager
const utils = require('./src/utils.js')
const interests = require('./src/interests.js')


// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', async () => {
  await FilmManager.instance.load(
    on_success = () => {
      client.user.setActivity('Type AYUDA for help', );

      client.channels.fetch(channelid).then(channel => {
        console.log("Cargando en caché mensajes de reacción:")
        let promarray = []
        for (let peli of FilmManager.instance.iterate()){
          console.log(peli.react_messages + " - " + peli.first_name)
          promarray.push(channel.messages.fetch(peli.react_messages, true))
        }
        Promise.all(promarray).then( value => {
          console.log('¡Listo!');
          client.channels.fetch(channelid).then(channel => channel.send('°･*: ．。．☆ Holi 。 ☆ ．。．:*･°'));
        })
      })


    },
    on_error = () => {
      console.error("No se ha podido cargar la lista")
    }
  );
});



client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Algo ha fallao, mi pana', ephemeral: true });
	}
});


client.on('interactionCreate', async interaction => { //Botones
	if (!interaction.isButton()) return;

  console.log(interaction)

  let user = interaction.user
  for (let peli of FilmManager.instance.iterate()){

    if (peli.react_messages.includes(interaction.message.id)){

      let inputpeli = peli.first_name
      let inputinteres = interaction.customId

      switch(inputinteres){
        case '1':		
          interests.add_very_interested(inputpeli, user).then( () => {
            interaction.reply({ content: "Tu interés en la peli **" + peli.first_name +"** es ahora positivo. Evitaremos verla si no estás.", ephemeral: true })
          }).catch( () => {
            interaction.reply({ content: "No se ha podido guardar tu gran interés en la peli **" + peli.first_name + "** :(. Algo se habrá roto."})
          })
          break
        
        case '0':				
          interests.remove_interest_for_film(inputpeli, user).then( () => {
            interaction.reply({ content: "Tu interés en la peli **" + peli.first_name +"** es ahora neutral, como Suiza.", ephemeral: true })
          }).catch( () => {
            interaction.reply({ content: "No se ha podido guardar tu neutralidad en la peli **" + peli.first_name + "** :(. Algo se habrá roto."})
          })
          break
        
        case '-1':
          interests.add_not_interested(inputpeli, user).then( () => {
            interaction.reply({ content: "Tu interés en la peli **" + peli.first_name +"** es ahora negativo. La veremos sin ti :).", ephemeral: true })
          }).catch( () => {
            interaction.reply({ content: "No se ha podido guardar tu desinterés en la peli **" + peli.first_name + "** :(. Algo se habrá roto."})
          })
          break
      }
    }
  }
})

// Login to Discord with your client's token
client.login(token);

