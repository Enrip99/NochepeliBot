const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ayuda')
		.setDescription('help'),
	async execute(interaction) {
		let msg = "Escribe **list** para ver la lista de películas.\n"
		+ "Escribe **add**  ***nombre de la peli*** para añadirla a la lista.\n"
		+ "Escribe **remove**  ***nombre de la peli*** para quitarla de la lista.\n\n"
		+ "Escribe **getlink**  ***nombre de la peli*** para obtener el enlace de la película.\n"
		+ "Escribe **addlink**  ***nombre de la peli***  **enlace** para añadir o modificar un enlace a una película.\n"
		+ "Escribe **removelink**  ***nombre de la peli*** para quitar el enlace de una película.\n\n"
		+ "Escribe **reallywant**  ***nombre de la peli*** para mostrar tu interés en la palícula. Serás mencionado cuando la vamos.\n"
		+ " - También puedes apuntarte reaccionando al mensaje que deja el bot al añadir una película.\n"
		+ "Escribe **dontwant**  ***nombre de la peli*** para mostrar tu desinterés por la película.\n"
		+ "Escribe **neutralwant**  ***nombre de la peli*** para ser eliminado de la lista de interés o desinterés.\n"
		+ "Escribe **mention**  ***nombre de la peli*** para mencionar a todos los interesados en esa película.\n"
		+ "Escribe **whowants**  **nombre de la peli** para ver todos los interesados y desinteresados de una película.\n\n"
		+ "Puedes no escribir el nombre de una película, y el bot realizará la acción sobre la última película con la que se haya interaccionado.\n\n"
		+ "Otros comandos varios:\n"
		+ "**ping** - Mide el tiempo de respuesta\n"
		+ "**ayuda** - Estás leyendo esto ahora mismo."

		await interaction.reply({ content: msg, ephemeral: true })
	},
};
