const utils = require('./utils.js')
const { MessageEmbed } = require('discord.js')
const { Message } = require('./message.js')

const DESCRIPTION_LIMIT = 4096

class ListRenderer {

    constructor(film_manager) {
        this.film_manager = film_manager
        this.pinned_message = null
    }
    

    async update(client) {
        if(!this.pinned_message) {
            return
        }

        let embeds = await this.generate_embeds(client)
        this.pinned_message.edit(client, { embeds: embeds })
    }
    

    async generate_embeds(client) {
        let listmsg = []
        await utils.parallel_for(this.film_manager.iterate(), async peli => {
            let msg = "\n**" + peli.first_name + "**"
            let tag_names = this.display_tag_names(peli)
            if(tag_names.length != "") {
                msg += " (" + tag_names + ")"
            }
            msg += "\n\☑️ " + peli.interested.length + " · ❎ " + peli.not_interested.length
            if(peli.not_interested.length - 3 >= peli.interested.length) {
                msg += " · ratio"
            }
            let user = await utils.get_user_by_id(client, peli.proposed_by_user)
            msg += " · Propuesta por **" + user.username + "**\n"
            msg += this.display_film_link_status(peli)
            listmsg.push(msg)
        })

        let embeds = ListRenderer.create_embeds_for_list("📽️✨ Pelis pendientes ✨", listmsg, DESCRIPTION_LIMIT)
        return embeds
    }



    /**
     * Crea ~Empotrados~ que son listas de los elementos que se pasan por parámetro, respetando el límite de caracteres dado.
     * No se puede meter más de 10 ~Empotrados~ en el mismo mensaje
     * @param {string} title El título que va a tener cada ~Empotrado~
     * @param {list[string]} list_of_items Lista de elementos que se van a repartir en los ~Empotrados~ que se van a crear
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
            embeds.push(new MessageEmbed()
            .setTitle(title + " (" + current_page + "/" + pages.length + ")")
            .setDescription(page))
        }
        if(embeds.length > 10) {
            console.warn("Se han creado más de 10 ~Empotrados~ de golpe. No se pueden meter más de 10 ~Empotrados~ en el mismo mensaje")
        }
        return embeds
    }


    display_tag_names(peli) {
        return peli.tags.join(", ")
    }


    display_film_link_status(peli) {
        let ret = ""
        if(!peli.link) {
            return ret
        }
        if(peli.link.includes(":?")) {
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
            console.error("Error al deserializar: " + e + " (JSON: " + json + ")")
        }
        return ret
    }
}

module.exports = { ListRenderer }