const { SlashCommandBuilder } = require("@discordjs/builders");
const { validate } = require("../../validate_inputpeli");
const utils = require("../../utils.js");
const { FilmManager } = require("../../film_manager");


module.exports = {
    data: new SlashCommandBuilder()
    .setName('removealias')
    .setDescription('borra un alias de una peli')
    .addStringOption(option => 
        option.setName('peli')
            .setDescription('la película cuyos aliases quieres borrar')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('alias')
            .setDescription('el alias a borrar')
            .setRequired(true)),

    /**
	 * 
	 * @param {import("discord.js").CommandInteraction} interaction 
	 */
	async execute(interaction) {

		/** 
		 * @type {string}
		 * @ts-ignore */
        let inputpeli = interaction.options.getString("peli")
		/** 
		 * @type {string}
		 * @ts-ignore */
        let inputalias = interaction.options.getString("alias")
        let peli = validate(inputpeli, interaction)
        if(peli == null) return

        let sanitized_alias = utils.sanitize_film_name(inputalias)
        if(inputalias == peli.sanitized_name) {
            interaction.reply({
                content: `"${inputalias}" no es un alias, es el nombre de la peli. No lo puedes quitar a no ser `
                + `que renombres la peli con \`/editname\`.`,
                ephemeral: true
            })
            return
        }
        if(!peli.aliases.includes(sanitized_alias)) {
            interaction.reply({
                content: `No sé de qué me hablas, ${peli.first_name} no tiene "${inputalias}" como alias.`,
                ephemeral: true
            })
            return
        }

        FilmManager.instance.remove_alias(peli.sanitized_name, sanitized_alias)
        try {
            await FilmManager.instance.save()
            interaction.reply({
                content: `Le he borrado el alias \"${inputalias}\" a ${peli.first_name}.`
            })
        } catch(e) {
            console.error(e)
            interaction.reply({
                content: `Por cualquier motivo no he podido borrar ese alias :/`,
                ephemeral: true
            })
        }

    }
}