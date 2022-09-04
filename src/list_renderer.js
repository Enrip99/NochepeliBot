const utils = require('./utils.js')
const { MessageEmbed } = require('discord.js')
const { Message } = require('./message.js')

const DESCRIPTION_LIMIT = 4096
const DEFAULT_LIST_TITLE = "📽️✨ Pelis pendientes ✨"

class ListRenderer {

    /** @type {import("./film_manager.js").FilmManager} */
    film_manager
    /** @type {Message?} */
    pinned_message

    /**
     * 
     * @param {import("./film_manager.js").FilmManager} film_manager 
     */
    constructor(film_manager) {
        this.film_manager = film_manager
        this.pinned_message = null
    }
    

    /**
     * 
     * @param {import("discord.js").Client} client 
     * @returns 
     */
    async update(client) {
        if(!this.pinned_message) {
            return
        }

        let embeds = await this.generate_embeds(client)
        this.pinned_message.edit(client, { embeds: embeds })
    }


    /**
     * 
     * @typedef {import("./film.js").Film} Film
     * @typedef {{message :string, peli :Film}} PeliObj
     * @param {import("discord.js").Client} client
     * @param {(p1 :Film, p2 :Film) => number} sort_criterion
     * @param {Iterable<Film>?} iterable
     * @returns 
     */
    async generate_embeds(client, sort_criterion = default_sort_criterion, character_limit = DESCRIPTION_LIMIT, include_hidden = false, iterable = null) {

        // TODO: Cambiar default_sort_criterion a string

        if(!iterable){
            iterable = this.film_manager.iterate()
        }

        /** @type {PeliObj[]} */
        let listobj = []
        await utils.parallel_for(iterable, async peli => {

            if(!include_hidden && peli.is_hidden()) return

            let msg = await this.render_film(client, peli)
            let obj = { 'message': msg, 'peli': peli } 
            listobj.push(obj)
        })

        let obj_sort_criterion = sort_criteria_film_to_obj(sort_criterion)
        listobj.sort(obj_sort_criterion)

        let listmsg = listobj.map( (element) => element.message )

        let embeds = ListRenderer.create_embeds_for_list(DEFAULT_LIST_TITLE, listmsg, character_limit)
        return embeds
    }


    /**
     * Crea ~Empotrados~ que son listas de los elementos que se pasan por parámetro, respetando el límite de caracteres dado.
     * No se puede meter más de 10 ~Empotrados~ en el mismo mensaje
     * @param {string} title El título que va a tener cada ~Empotrado~
     * @param {string[]} list_of_items Lista de elementos que se van a repartir en los ~Empotrados~ que se van a crear
     * @param {number} character_limit
     */
    static create_embeds_for_list(title, list_of_items, character_limit) {
        let pages = []
        let current_page = 0
        pages[current_page] = ""
        for(let msg of list_of_items) {
            if(pages[current_page].length + msg.length > character_limit) {
                current_page += 1
                pages[current_page] = ""
            }
            if(msg.length > character_limit) {
                console.warn("A message has been skipped because it's too long")
                continue
            }
            pages[current_page] += msg
        }
        let embeds = []
        current_page = 0
        for(let page of pages) {
            current_page += 1
            let pages_text = pages.length != 1 ? `(${current_page}/${pages.length})` : ""
            embeds.push(new MessageEmbed()
            .setTitle(`${title} ${pages_text}`)
            .setDescription(page))
        }
        if(embeds.length > 10) {
            console.warn("Se han creado más de 10 ~Empotrados~ de golpe. No se pueden meter más de 10 ~Empotrados~ en el mismo mensaje")
        }
        return embeds
    }


    /**
     * 
     * @param {number} page_number 
     * @param {number} items_per_page
     * @param {(p :Film) => boolean} filter
     * @param {(p1 :Film, p2 :Film) => number} sort_criterion
     * @param {string} base_page_title
     */
    async create_single_page_embed(page_number, items_per_page,
        filter = (p) => true, sort_criterion = default_sort_criterion, include_hidden = false, base_page_title = DEFAULT_LIST_TITLE) {

        /** Filtro pasado por parámetro + filtrar/no filtrar ocultas */
        /** @type {(p :Film) => boolean} */
        let filter_plus_hidden = peli => filter(peli) && (include_hidden || !peli.is_hidden) 

        /** @type {Film[]} */
        let film_list = []
        for(let film of this.film_manager.iterate()) {
            if(filter_plus_hidden(film)){
                film_list.push(film)
            }
        }

        let page_total = Math.ceil(film_list.length / items_per_page)
        page_number = (page_number + page_total) % page_total
        if(isNaN(page_number)) page_number = 0
        let first_item = items_per_page * page_number
        let displayed_page_number = page_total != 0 ? page_number + 1 : 0

        film_list = film_list.sort(sort_criterion).slice(first_item, first_item + items_per_page)
    
        let page_title = `${base_page_title} (${displayed_page_number}/${page_total})`

        return {
            embed: this.create_single_page_embed_from_list(film_list, sort_criterion, page_title),
            page_number: page_number,
            page_total: page_total
        }

    }


    /**
     * 
     * @param {Film[]} film_list
     * @param {(p1 :Film, p2 :Film) => number} sort_criterion
     * @param {string} page_title
     * @param {boolean} slim_format
     */
         async create_single_page_embed_from_list(film_list, sort_criterion = default_sort_criterion, page_title = DEFAULT_LIST_TITLE, slim_format = false) {
            
            film_list = film_list.sort(sort_criterion)
            
            /** @type {PeliObj[]} */
            let listobj = []
            await utils.parallel_for(film_list, async peli => {

                let msg = await this.render_film(this.film_manager.client, peli, slim_format)
                let obj = { 'message': msg, 'peli': peli } 
                listobj.push(obj)

            })

            let msg = listobj.map((element) => element.message).join("")
            if(msg.length > DESCRIPTION_LIMIT) {
                console.warn(`Se ha generado una página con más de ${DESCRIPTION_LIMIT} caracteres. Discord no soporta más caracteres en un embed.`)
            }
    
            return new MessageEmbed()
                .setTitle(page_title)
                .setDescription(msg)
        }
    



    /**
     * 
     * @param {import("discord.js").Client} client
     * @param {Film} peli 
     * @param {boolean} slim_format
     */
     async render_film(client, peli, slim_format = false) {

        let msg
        if(slim_format){
           msg = `\n• **${peli.first_name}**`
        }
        else{
            msg = `\n**${peli.first_name}**`
            let tag_names = this.display_tag_names(peli)
            if(tag_names != "") {
                msg += ` (${tag_names})`
            }
            msg += `\n\☑️ ${peli.interested.length} · ❎ ${peli.not_interested.length}`
            if(peli.norm() < 0) {
                msg += " · ratio"
            }
            let user = await utils.get_user_by_id(client, peli.proposed_by_user)
            msg += ` · Propuesta por **${user.username}**`
            msg += this.display_film_link_status(peli) + "\n"
        }
        
        return msg
        
    }


    /**
     * @param {import("./film.js").Film} peli
     */
    display_tag_names(peli) {
        return peli.tags.map( (tag) => tag.tag_name ).join(", ")
    }


    /**
     * @param {import("./film.js").Film} peli
     */
    display_film_link_status(peli) {
        let ret = ""
        if(!peli.link) {
            return ret
        }
        if(peli.link.includes("magnet:?")) {
            ret = " · 🧲"
        } else if(peli.link.includes("://")) {
            ret = " · 🔗"
        } else {
            ret = " · 🔗...?"
        }
        return ret
    }


    serialize() {
        return {
            pinned_message: !!this.pinned_message ? this.pinned_message.serialize() : null
        }
    }


    /**
     * 
     * @param {any} json
     * @param {import("./film_manager.js").FilmManager} film_manager
     */
    static deserialize(json, film_manager) {
        if(!json) {
            return new ListRenderer(film_manager)
        }
        let ret = null
        try {
            let data = json
            ret = new ListRenderer(film_manager)
            ret.pinned_message = Message.deserialize(data.pinned_message)
        } catch(e) {
            console.error(`Error al deserializar: ${e} (JSON: ${json})`)
        }
        return ret
    }
}

//Funciones privadas

/**
 * @param {Film} p1 
 * @param {Film} p2 
 * @returns {number} 
 */
function default_sort_criterion(p1, p2){
    return p1.compareTo(p2)
}

/**
 * @typedef {{peli :import("./film.js").Film}} PeliObjLike
 * @param {(p1 :Film, p2 :Film) => number} sort_criterion
 * @returns {(p1 :PeliObjLike, p2 :PeliObjLike) => number}
 */
 function sort_criteria_film_to_obj(sort_criterion){
    return (obj1, obj2) => sort_criterion(obj1.peli, obj2.peli) 
}

module.exports = { ListRenderer }