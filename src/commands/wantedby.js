const { SlashCommandBuilder } = require('@discordjs/builders');
const { FilmManager } = require('../film_manager.js');
const interests = require('../interests.js')

const FILMS_PER_PAGE = 100

module.exports = {
	data: new SlashCommandBuilder()
	.setName('wantedby')
	.setDescription('Comprueba qué pelis quiere o no quiere ver un usuario')
    .addUserOption(option => 
        option.setName('usuario')
            .setDescription('el usuario a consultar (default: tú)')
            .setRequired(false))
    .addStringOption(option =>
        option.setName('interés')
            .setDescription('Nivel de interés (default: todas)')
            .setRequired(false)
            .addChoices({name: '✔️ Quiere ver ✔️', value: 'positivo'}, 
                        {name: '🤷 Neutral 🤷', value: 'neutral'}, 
                        {name: '❌ No quiere ver ❌', value: 'negativo'},                      
                        {name: 'Todas', value: 'todas'}))
    .addIntegerOption(option =>
        option.setName('ocultas')
            .setDescription('¿Mostrar ocultas? (default: no)')
            .setRequired(false)
            .addChoices({name: 'Sí', value: 1}, 
                        {name: 'No', value: 0},
                        {name: 'Solo ocultas', value: -1})),
    /** 
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(interaction) {
		
        /** TODO:
         *  Meter parámetro para el orden de las pelis
         */

		let inputuser = interaction.options.getUser('usuario')
        let inputinteres = interaction.options.getString('interés') ?? 'todas'
        let inputocultas = interaction.options.getInteger('ocultas')

        let ocultas = inputocultas ?? false
        let solo_ocultas = inputocultas == -1

        let user = inputuser ?? interaction.user

        let interest_list = await interests.get_user_interest_list(user.id)

        /** @type { Record<string, string> } */
        let titulos_interes = {
            positivo: `✔️ Películas en las que está interesado el usuario **${ user.username }**`,
            neutral: `🤷 Películas que ni le van ni le vienen al usuario **${ user.username }**`,
            negativo: `❌ Películas en las que NO está interesado el usuario **${ user.username }**`,
        }

        if(!ocultas || solo_ocultas){

            for( let key of Object.keys(interest_list) ){
                interest_list[key] = interest_list[key].filter( (peli) => solo_ocultas === peli.is_hidden() ) //reverse XOR
            }

        } 

        let keys = ['positivo', 'neutral', 'negativo']
        let embeds = []

        for( let key of keys ){
            if( inputinteres == key || inputinteres == 'todas'){
                let render_data = await FilmManager.instance.list_renderer.create_single_page_embed_from_list(interest_list[key],
                    undefined,
                    titulos_interes[key],
                    true)
                embeds.push(render_data)
            }
        }

        interaction.reply({embeds: embeds})
        
	}
};

