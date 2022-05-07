// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, guildId, channelId } = require('./data/config.json');
const { FilmManager } = require('./src/film_manager.js')
const { Message } = require('./src/message.js')
const { Film } = require('./src/film.js')
const utils = require('./src/utils.js')
const interests = require('./src/interests.js');
const { MessageActionRow, MessageButton, TextChannel } = require('discord.js');
const { InteractiveMessageManager } = require('./src/interactive_message_manager');
const DiscordMessage = require("discord.js").Message


// Create a new client instance
/** @type {import('discord.js').Client} */
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

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


client.on('interactionCreate', async interaction => { //Botones
	if (!interaction.isButton()) return;
  if (interaction.guildId != guildId) return
  if(!(interaction.message instanceof DiscordMessage)) return;  //typecheck

  //TODO: mover esta ristra enorme a subarchivos, igual que con commands
  let user = interaction.user 

  let interaction_msg = Message.from(interaction.message)
  
  for (let peli of FilmManager.instance.iterate()){

    if(peli.tag_manager_message && peli.tag_manager_message.equals(interaction_msg)){

      interaction.deferUpdate()

      let inputtag = interaction.customId
      let tag = FilmManager.instance.get_tag(inputtag)

      if(!tag) return //typecheck

      if(peli.tags.includes(tag)){
        utils.remove_from_list(peli.tags, tag)
      } else{
        peli.tags.push(tag)
      }

      //copypasteado de maangetags.js. Iteramos de nuevo por todos los tags porque me da palo buscar un modo mejor.

      let counter = 0

      /** @type {MessageActionRow[]} s} */
      const rows = []
      
      let row = new MessageActionRow()

      for(let tag of FilmManager.instance.iterate_tags()){

          counter += 1
          if(counter > 5){
              counter -= 5
              rows.push(row)
              row = new MessageActionRow()
          }

          let tag_button = new MessageButton()
                          .setCustomId(tag.sanitized_name)
                          .setLabel(tag.tag_name + (tag.hidden ? " (OCULTO)" : ""))

          if(peli.tags.includes(tag)){
              tag_button.setStyle('SUCCESS')
          }
          else{
              tag_button.setStyle('SECONDARY')
          }

          row.addComponents(tag_button)

      }    
      rows.push(row)

      try {
        await FilmManager.instance.save()
        interaction.message.edit({ components: rows})
      } catch(e) {
        console.error(e)
      }
      
    }
  }

  if(interaction.customId == 'cancel'){
    interaction.message.edit({ content: `Acción cancelada por el usuario ${user.username}.`, components: []})
  }

  let delete_tag_regex = /delete tag (.*)/gm
  let regmatch = delete_tag_regex.exec(interaction.customId)
  
  if(regmatch){
      let inputtag = regmatch[1]
      FilmManager.instance.remove_tag(inputtag)
      try {
        await FilmManager.instance.save()
        interaction.message.edit({ content: `El tag **${inputtag}** se ha borrado de la lista de tags.`, components: []})
      } catch(e) {
        interaction.message.edit({ content: `No se ha podido borrar el tag **${inputtag}** :(`, components: []})
      }
  }

})

// Login to Discord with your client's token
client.login(token);


for(let p of ["SIGQUIT", "SIGINT", "SIGTERM", "SIGBREAK", "SIGHUP", "exit"]) {
  process.on(p, () => utils.shut_down(client))
}
