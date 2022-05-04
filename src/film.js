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

class Film {

    constructor(name, proposed_by_user) {
        this.first_name = name.trim()
        this.sanitized_name = utils.sanitize_film_name(name)
        this.proposed_by_user = proposed_by_user
        this.link = null
        this.interested = [proposed_by_user]
        this.not_interested = []
        this.tags = []
        this.react_message = null
        this.tag_manager_message = null
    }


    equals(other) {
        return other instanceof Film && this.sanitized_name === other.sanitized_name
    }


    toString() {
        return "[Film : " + this.sanitized_name + "]"
    }


    serialize() {
        return {
            first_name: this.first_name,
            proposed_by_user: this.proposed_by_user,
            link: this.link,
            interested: this.interested,
            not_interested: [],
            tags: [],
            react_message: null,
            tag_manager_message: null
        }
    }

    static deserialize(json) {
        if(!json) {
            return null
        }
        let ret = null
        try {
            let data = json
            ret = new Film(data.first_name, data.proposed_by_user)
            for(let key in data) {
                ret[key] = data[key]
            }

        } catch(e) {
            console.error("Error al deserializar: " + e + " (JSON: " + json + ")")
        }
        return ret
    }
}

module.exports = { Film }
