const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { FilmManager } = require("../../film_manager");
const { validate } = require("../../validate_inputpeli");


module.exports = {
    data: new SlashCommandBuilder()
    .setName('getalias')
    .setDescription('consulta los aliases de una peli')
    .addStringOption(option => 
        option.setName('peli')
            .setDescription('la película cuyos aliases quieres consultar')
            .setRequired(true)),

    /**
	 * 
	 * @param {import("discord.js").CommandInteraction} interaction 
	 */
	async execute(interaction) {

        let inputpeli = interaction.options.getString('peli')
        let peli = validate(inputpeli, interaction)
        if(peli == null) return

        if(peli.aliases.length == 0) {
            interaction.reply({
                content: `La película ${peli.first_name} no tiene aliases. Puedes añadir algunos con \`/addalias\``,
                ephemeral: true
            })
            return
        }

        let embed = new MessageEmbed()
        embed.setTitle(`Aliases de ${peli.first_name}`)
        let description = "Los aliases se muestran sanitizados. Podéis usarlos intercalando espacios, símbolos, mayúsculas, etc.\n"
        for(let alias of peli.aliases) {
            let obscured = FilmManager.instance.is_alias_obscured(peli.sanitized_name, alias)
            if(obscured) {
                description += `• ~~${alias}~~ (Lo usa ${obscured.first_name})\n`
            } else {
                description += `• ${alias}\n`
            }
        }
        embed.setDescription(description)
        interaction.reply({
            embeds: [embed]
        })
    }
}