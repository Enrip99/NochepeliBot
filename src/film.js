const utils = require("./utils.js")

/**
 * Objeto que representa una peli
 * @param {string} name Nombre de la peli, sin sanitizar
 * @param {int} proposed_by_user El id del usuario que la ha propuesto
 *
 * Campos:
 * @field `first_name` — El nombre de la peli tal y como lo escribió quien la propuso
 * @field `sanitized_name` — El nombre de la peli como se usa internamente
 * @field `proposed_by_user` — El id del usuario que la propuso
 * @field `link` — Link para descargar la peli. Puede ser `null`.
 * @field `interested` — Lista de ids de usuarios particularmente interesados
 * @field `not_interested` — Lista de ids de usuarios no interesados
 * @field `tags` — Tags de la peli vamos a ver es autoevidente
 */
function Film(name, proposed_by_user) {
    this.first_name = name.trim()
    this.sanitized_name = utils.sanitize_film_name(name)
    this.proposed_by_user = proposed_by_user
    this.link = null
    this.interested = [proposed_by_user]
    this.not_interested = []
    this.react_messages = []
    this.tags = []
}

module.exports = { Film }
