const utils = require("./utils.js")
const { Message } = require("./message.js")
const { Tag } = require("./tag.js")


class Film {

    /** @type {string} El nombre de la peli tal y como lo escribió quien la propuso */
    first_name
    /** @type {string} El nombre de la peli como se usa internamente */
    sanitized_name
    /** @type {import("discord.js").Snowflake} El id del usuario que la propuso */
    proposed_by_user
    /** @type {string?} Link para descargar la peli */
    link
    /** @type {import("discord.js").Snowflake[]} Lista de ids de usuarios particularmente interesados */
    interested
    /** @type {import("discord.js").Snowflake[]} Lista de ids de usuarios no interesados */
    not_interested
    /** @type {Tag[]} Tags de la peli vamos a ver es autoevidente */
    tags
    /** @type {string[]} Nombres sanitizados alternativos por los que te puedes referir a la película */
    aliases

    /**
     * 
     * @param {string} name 
     * @param {import("discord.js").Snowflake} proposed_by_user 
     */
    constructor(name, proposed_by_user) {
        this.first_name = name.trim()
        this.sanitized_name = utils.sanitize_film_name(name)
        this.proposed_by_user = proposed_by_user
        this.link = null
        this.interested = [proposed_by_user]
        this.not_interested = []
        this.tags = []
        this.aliases = []
    }

    /**
     * 
     * @param {any} other 
     * @returns 
     */
    equals(other) {
        return other instanceof Film && this.sanitized_name === other.sanitized_name
    }


    toString() {
        return `[Film : ${this.first_name}]`
    }


    /**
     * @return { number }
     */
    norm(){
        return this.interested.length - 0.99*this.not_interested.length
    }

    /**
     * @param {Film} other
     * @param {'INTEREST' | 'ALPHA'} comparison_criterion
     */
    compareTo(other, comparison_criterion = 'INTEREST') {

        switch(comparison_criterion){

            case 'INTEREST':
                let ret = other.norm() - this.norm()
                if( ret == 0 ){ //Si ambas pelis tienen la misma norma, las ordenamos alfabéticamente
                    ret = this.compareTo(other, 'ALPHA')
                }
                return ret
            
            case 'ALPHA':
                return this.sanitized_name.localeCompare(other.sanitized_name)

            default:
                console.warn(`El criterio de comparación ${comparison_criterion} no es válido.`)
                return 0
        }
    }

    
    /** @returns { boolean } */
    is_hidden() {
        //Si algún tag está oculto, la peli está oculta
        return this.tags.some((tag) => tag.hidden)  
    }


    serialize() {
        return {
            first_name: this.first_name,
            proposed_by_user: this.proposed_by_user,
            link: this.link,
            interested: this.interested,
            not_interested: this.not_interested,
            tags: this.tags.map( (tag) => tag.sanitized_name ),
            aliases: this.aliases
        }
    }

    /**
     * 
     * @param {any} json 
     * @param {{[sanitized_name :string]: Tag}} tag_dict 
     * @returns 
     */
    static deserialize(json, tag_dict) {
        if(!json || !tag_dict) {
            return null
        }
        let ret = null
        try {
            let data = json
            ret = new Film(data.first_name, data.proposed_by_user)
            for(let key in data) {
                /** @ts-ignore */
                ret[key] = data[key]
            }
            /** @type {string[]} */
            let data_tags = data.tags ?? []
            ret.tags = data_tags.map( (sanitized_tag_name) => tag_dict[sanitized_tag_name]) 
            //Hace falta pasarle el tag_dict para evitar bucle de dependencias
            ret.aliases = data.aliases ?? []

        } catch(e) {
            console.error(`Error al deserializar: ${e} (JSON: ${json})`)
        }
        return ret
    }
}

module.exports = { Film }
