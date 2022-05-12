const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require('../film_manager.js');
const utils = require('../utils.js')


module.exports = {
	data: new SlashCommandBuilder()
	.setName('suggest')
	.setDescription('Sugiere una película al azar, teniendo en cuenta el número de interesados')
    .addStringOption(option => 
        option.setName('tag')
            .setDescription('tag por el que filtrar (default: los no ocultos)')
            .setRequired(false)),
    /** 
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(interaction) {
		
        let inputtag = interaction.options.getString('tag')
        
        let iterable 

        
        if(inputtag){
            let tag = FilmManager.instance.get_tag(inputtag)
            if(!tag){
                interaction.reply({ content:`No existe el tag **${inputtag}** :(`, ephemeral: true })
                return
            } else {
                iterable = FilmManager.instance.films_with_tag(inputtag)
                if( iterable.length == 0){
                    interaction.reply({ content:`El tag **${inputtag}** no tiene películas asociadas :(`, ephemeral: true })
                    return
                }
            }
        } else {
            iterable = FilmManager.instance.iterate()
        }

        await interaction.deferReply() //Esto igual tarda un ratillo? idk

        let pelis = []
        let weigths = []

        for(let peli of iterable){
            
            pelis.push(peli)
            weigths.push(Math.max(peli.norm(), 0.1)) //si la norma es 0 o menos, le damos un valor pequeñito

        }
        
        let peli_elegida = utils.random_from_list(pelis, weigths)
        let interesados = await Promise.all(peli_elegida.interested.map(v => utils.get_user_by_id(interaction.client, v)))

        let p = `**${peli_elegida.first_name}**`

        let phrases = [
            `¿Qué tal ${p}?`,
            `¿Y si veis ${p}?`,
            `Echadle un ojo a ${p}.`,
            `Considerad: ${p}.`
        ]

        let frase_elegida = `${utils.random_from_list(phrases)}\nLa quieren ver: ${interesados.map(u => u.username).join(", ")}`

        await interaction.editReply(frase_elegida)
        
	}
};

