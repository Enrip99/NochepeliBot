const fs = require('fs');
const utils = require('./utils.js')
const { Film } = require ('./film.js')
const { Tag } = require('./tag.js')
const { ListRenderer } = require('./list_renderer.js')


const LISTA_LOCATION = "data/lista.json"

class FilmManager {

    /** @type {FilmManager} */
    static instance
    /** @type {{[name :string]: Film}} */
    pelis
    /** @type {{[sanitized_name :string]: Tag}} */
    tags
    /** @type {import("discord.js").Client} */
    client
    /** @type {ListRenderer} */
    list_renderer

    /**
     * 
     * @param {import("discord.js").Client} client 
     */
    constructor(client) {
        this.pelis = {}
        this.tags = {}
        this.client = client
        this.list_renderer = new ListRenderer(this)
    }


    /**
     * Añade una peli a la lista
     * @param {string} film_name El nombre de la peli, sin sanitizar
     * @param {import("discord.js").Snowflake} proposed_by_user El id del usuario que la ha propuesto
     * @returns Si la película ha sido añadida por primera vez
     */
    add(film_name, proposed_by_user) {
        let sanitized_name = utils.sanitize_film_name(film_name)
        console.log("Añadida peli " + sanitized_name)
        let ret = sanitized_name in this.pelis
        if(!ret) {
            this.pelis[sanitized_name] = new Film(film_name, proposed_by_user)
        }
        this.list_renderer.update(this.client)
        return !ret // TODO Devolver [ret, this.pelis[sanitized_name]]
    }


    /**
     * Quita una peli de la lista
     * @param {string} film_name El nombre de la peli, sin sanitizar
     * @returns Si la película existía antes de quitarla
     */
    remove(film_name) {
        film_name = utils.sanitize_film_name(film_name)
        console.log("Eliminada peli " + film_name)
        let ret = delete this.pelis[film_name]
        this.list_renderer.update(this.client)
        return ret
    }


        /**
     * Edita el nombre de una peli de la lista
     * @param {string} old_name El nombre de la peli, sin sanitizar
     * @param {string} new_name El nuevo nombre de la peli, sin sanitizar
     * @returns Si la película existía o el nuevo nombre ya existe
     */
    edit_name(old_name, new_name) {
        let old_sanitized_name = utils.sanitize_film_name(old_name)
        let new_sanitized_name = utils.sanitize_film_name(new_name)
        console.log(`La peli ${old_sanitized_name} ahora se llama ${new_sanitized_name}`)

        if(old_sanitized_name != new_sanitized_name){
            if(!(old_sanitized_name in this.pelis) || (new_sanitized_name in this.pelis)){
                return false
            }
        }
        let old_peli = this.pelis[old_sanitized_name]

        old_peli.first_name = new_name
        old_peli.sanitized_name = new_sanitized_name

        this.pelis[new_sanitized_name] = old_peli
        if(old_sanitized_name != new_sanitized_name){
            delete this.pelis[old_sanitized_name]
        }
        this.list_renderer.update(this.client)
        return true

    }


    /**
     * Comprueba qué películas tienen asociadas cierto tag
     * @param {string} tag_name El nombre del tag, sin sanitizar
     * @returns Una lista de películas (Film) con dicho tag (posiblemente vacía)
     */

    films_with_tag(tag_name) {
        
        let tag = this.get_tag(tag_name)
        if(!tag) {
            return []
        }
        let ret = []

        for(let peli of Object.values(this.pelis)){
            if(peli.tags.includes(tag)){
                ret.push(peli)
            }
        }
        
        return ret
    }
    

    /**
     * Añade un tag a la lista de tags
     * @param {string} tag_name El nombre del tag, sin sanitizar
     * @returns Si el tag ha sido añadido por primera vez
     */
    add_tag(tag_name) {
        let sanitized_name = utils.sanitize_film_name(tag_name)
        console.log("Añadido tag " + sanitized_name)
        let ret = sanitized_name in this.tags
        if(!ret) {
            this.tags[sanitized_name] = new Tag(tag_name)
            this.tags[sanitized_name].sanitized_name = sanitized_name
        }
        this.list_renderer.update(this.client)
        return !ret
    }


    /**
     * Quita un tag de la lista de tags
     * @param {string} tag_name El nombre del tag, sin sanitizar
     * @returns Si el tag existía antes de quitarlo. Si no se puede borrar, retorna -1.
     */
    remove_tag(tag_name) {

        let tag = this.get_tag(tag_name)
        let films_with_tag = this.films_with_tag(tag_name)

        for(let film of films_with_tag){
            utils.remove_from_list(film.tags, tag)
        }
        
        console.log("Eliminado tag " + tag.sanitized_name)
        this.list_renderer.update(this.client)
        return delete this.tags[tag.sanitized_name]
    }


    /**
     * Devuelve una peli, si existe. En caso contrario devuelve `null`
     * @param {string} film_name El nombre de la peli, sin sanitizar
     * @returns {Film?} El objeto que representa la peli o `null`
     */
    get(film_name) {
        film_name = utils.sanitize_film_name(film_name)
        return this.pelis[film_name] ?? null
    }


    /**
     * Devuelve un tag, si existe. En caso contrario devuelve `null`
     * @param {string} tag_name El nombre del tag, sin sanitizar
     * @returns {Tag?} El objeto que representa al tag o `null`
     */
    get_tag(tag_name) {
        tag_name = utils.sanitize_film_name(tag_name)
        return this.tags[tag_name] ?? null
    }


    /**
     * Indica si hay una peli registrada con ese nombre
     * @param {string} film_name El nombre de la peli, sin sanitizar
     * @returns Si la peli existe o no
     */
    exists(film_name) {
        film_name = utils.sanitize_film_name(film_name)
        return film_name in this.pelis
    }

    /**
     * Indica si hay un tag registrado con ese nombre
     * @param {string} tag_name El nombre del tag, sin sanitizar
     * @returns Si el tag existe o no
     */
    exists_tag(tag_name) {
        tag_name = utils.sanitize_film_name(tag_name)
        return tag_name in this.tags
    }


    /**
     * Devuelve el número de pelis que hay en la lista
     * @returns el número de pelis que hay en la lista
     */
    count() {
        return Object.keys(this.pelis).length
    }


    /**
     * Itera por todas las pelis añadidas
     */
    *iterate() {
        for(let film of Object.keys(this.pelis)) {
            yield this.pelis[film]
        }
    }

    /**
     * Itera por todos los tags añadidos
     */
    *iterate_tags() {
        for(let tag of Object.keys(this.tags)) {
            yield this.tags[tag]
        }
    }


    /**
     * Escribe las pelis del bot en ~La Lista~ para que sea persistente.
     * Retorna una promesa.
     * @returns {Promise<void>}
     */
    save() {
        console.log("Guardando la lista...")
        let serialized_pelis = []
        for(let peli of Object.values(this.pelis)) {
            serialized_pelis.push(peli.serialize())
        }
        let lista = {
            pelis: serialized_pelis,
            tags: this.tags,
            list_renderer: this.list_renderer.serialize()
        }
        
        return new Promise((resolve, reject) => {
            fs.writeFile(LISTA_LOCATION, JSON.stringify(lista, null, 4), function(err) {
                if (err) {
                    console.error(err)
                    reject()
                } else {
                    console.log("Guardada la lista en disco.")
                    resolve()
                }
            })    
        })
    }


    /**
     * Carga las pelis guardadas en ~La Lista~ para que el bot las tenga disponibles
     * Retorna una promesa.
     * @returns {Promise<void>}
     */
    load() {
        console.log("Cargando la lista...")
        let this_instance = this
        return new Promise( (resolve, reject) => {
            fs.readFile(LISTA_LOCATION, "utf8", async function(err, data) {
                if(err) {
                    console.error(err)
                    reject()
                } else {
                    try {
                        let parsed_data = JSON.parse(data)
                        this_instance.tags = parsed_data.tags ?? {}
                        if(!parsed_data.pelis) {
                            this_instance.pelis = {}
                        }
                        else for(let film of Object.values(parsed_data.pelis)) {
                            let deserialized_film = Film.deserialize(film, this_instance.tags)
                            if(deserialized_film) {
                                this_instance.pelis[deserialized_film.sanitized_name] = deserialized_film
                            }
                        }
                        let deserialized_list_renderer = ListRenderer.deserialize(parsed_data.list_renderer ?? {}, this_instance)
                        if(!deserialized_list_renderer) {
                            deserialized_list_renderer = new ListRenderer(this_instance)
                        }
                        this_instance.list_renderer = deserialized_list_renderer
                        console.log("Cargada la lista desde disco.")
                        this_instance.list_renderer.update(this_instance.client)
                        resolve()
                    } catch(e) {
                        console.error("Error al cargar de disco: " + e)
                        reject()
                    }
                }
            })
        })    
        
    }
}

/* @ts-ignore */
FilmManager.instance = new FilmManager(null)


module.exports = { FilmManager }
