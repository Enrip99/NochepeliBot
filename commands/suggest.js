const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require('../src/film_manager.js');
const interests = require('../src/interests.js')


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


        /**
         * @template {any} T
         * @param {T[]} items 
         * @param {number[]} weights 
         * @returns {T}
         */
        function weighted_random(items, weights) { //sacada de StackOverflow porque me da pereza escribirla yo
            var i;
        
            for (i = 0; i < weights.length; i++)
                weights[i] += weights[i - 1] || 0;
            
            var random = Math.random() * weights[weights.length - 1];
            
            for (i = 0; i < weights.length; i++)
                if (weights[i] > random)
                    break;
            
            return items[i];
        }

        let peli_elegida = weighted_random(pelis, weigths)

        await interaction.editReply(`Peli elegida: **${peli_elegida.first_name}**.`)
        
	}
};

