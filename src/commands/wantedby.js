const { SlashCommandBuilder } = require('@discordjs/builders');
const interests = require('../interests.js')


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
                        {name: '❌ No quiere ver ❌', value: 'negativo'}))
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
		
		let inputuser = interaction.options.getUser('usuario')
        let inputinteres = interaction.options.getString('interés')
        let inputocultas = interaction.options.getInteger('ocultas')

        let ocultas = inputocultas ?? false
        let solo_ocultas = inputocultas == -1

        let user = inputuser ?? interaction.user

        let interest_list = await interests.get_user_interest_list(user.id)


        if(!ocultas || solo_ocultas){

            for( let key of Object.keys(interest_list) ){
                interest_list[key] = interest_list[key].filter( (peli) => solo_ocultas === peli.is_hidden() ) //reverse XOR
            }

        } 


        let msg_positivo = `✔️ Películas en las que está interesado el usuario **${ user.username }**:\n${ interest_list.positivo.map( (peli) => peli.first_name ).join(', ') }` 
        let msg_neutral = `🤷 Películas que ni le van ni le vienen al usuario **${ user.username }**:\n${ interest_list.neutral.map( (peli) => peli.first_name ).join(', ') }` 
        let msg_negativo = `❌ Películas en las que NO está interesado el usuario **${ user.username }**:\n${ interest_list.negativo.map( (peli) => peli.first_name ).join(', ') }` 

        switch( inputinteres ){
            case 'positivo':                
                interaction.reply(msg_positivo)
                break

            case 'neutral':
                interaction.reply(msg_neutral)
                break

            case 'negativo':
                interaction.reply(msg_negativo)
                break
            
            default: //null
                interaction.reply(`${msg_positivo}\n\n${msg_neutral}\n\n${msg_negativo}`)

        }
        
	}
};

