const utils = require("./utils.js")
const { Message } = require("./message.js")

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
        return `[Film : ${this.sanitized_name}]`
    }

    compareTo(other, comparison_criterion = 'INTEREST') {

        switch(comparison_criterion){

            case 'INTEREST':
                let norm = ( peli ) => peli.interested.length - peli.not_interested.length
                let ret = norm( other ) - norm( this ) 
                if( ret == 0 ){ //Si ambas pelis tienen la misma norma, las ordenamos alfabéticamente
                    return this.compareTo(other, 'ALPHA')
                }
                return ret
            
            case 'ALPHA':
                return this.sanitized_name.localeCompare(other.sanitized_name)

            default:
                console.warn(`El criterio de comparación ${comparison_criterion} no es válido.`)
                return 0
        }
    }


    serialize() {
        return {
            first_name: this.first_name,
            proposed_by_user: this.proposed_by_user,
            link: this.link,
            interested: this.interested,
            not_interested: this.not_interested,
            tags: this.tags,
            react_message: this.react_message,
            tag_manager_message: this.tag_manager_message
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
            ret.react_message = Message.deserialize(data.react_message)
            ret.tag_manager_message = Message.deserialize(data.tag_manager_message)

        } catch(e) {
            console.error(`Error al deserializar: ${e} (JSON: ${json})`)
        }
        return ret
    }
}

module.exports = { Film }
