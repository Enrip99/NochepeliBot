const fs = require('fs');
const utils = require('./utils.js')
const { Film } = require ('./film.js')

const LISTA_LOCATION = "data/lista.json"


FilmManager = function() {
    this.dict = {}
    this.latest_film = null
}

/** @type {FilmManager} */
FilmManager.instance = new FilmManager()

/**
 * Añade una peli a la lista
 * @param {string} film_name El nombre de la peli, sin sanitizar
 * @param {int} proposed_by_user El id del usuario que la ha propuesto
 * @returns Si la película ha sido añadida por primera vez
 */
FilmManager.prototype.add = function(film_name, proposed_by_user) {
    let sanitized_name = utils.sanitize_film_name(film_name)
    console.log("Añadida peli " + sanitized_name)
    let ret = sanitized_name in this.dict
    if(!ret) {
        this.dict[sanitized_name] = new Film(film_name, proposed_by_user)
    }
    return !ret
}

/**
 * Quita una peli de la lista
 * @param {string} film_name El nombre de la peli, sin sanitizar
 * @returns Si la película existía antes de quitarla
 */
FilmManager.prototype.remove = function(film_name) {
    film_name = utils.sanitize_film_name(film_name)
    console.log("Eliminada peli " + film_name)
    return delete this.dict[film_name]
}


/**
 * Devuelve una peli, si existe. En caso contrario devuelve `null`
 * @param {string} film_name El nombre de la peli, sin sanitizar
 * @returns El objeto que representa la peli o `null`
 */
FilmManager.prototype.get = function(film_name) {
    film_name = utils.sanitize_film_name(film_name)
    return this.dict[film_name] ?? null
}


/**
 * Indica si hay una peli registrada con ese nombre
 * @param {string} film_name El nombre de la peli, sin sanitizar
 * @returns Si la peli existe o no
 */
FilmManager.prototype.exists = function(film_name) {
    film_name = utils.sanitize_film_name(film_name)
    return film_name in this.dict
}


/**
 * Devuelve el número de pelis que hay en la lista
 * @returns el número de pelis que hay en la lista
 */
FilmManager.prototype.count = function() {
    return Object.keys(this.dict).length
}


/**
 * Itera por todas las pelis añadidas
 */
FilmManager.prototype.iterate = function*() {
    for(let film of Object.keys(this.dict)) {
        yield this.dict[film]
    }
}


/**
 * Indica la peli dada como la última de la que se ha hablado, para el propósito de algunos comandos
 * @param {string} film_name El nombre de la peli, sin sanitizar
 */
FilmManager.prototype.set_latest_film = function(film_name) {
    film_name = film_name ? utils.sanitize_film_name(film_name) : null
    if(film_name && this.exists(film_name)) {
        this.latest_film = film_name
    } else {
        this.latest_film = null
    }
}


/**
 * Escribe las pelis del bot en ~La Lista~ para que sea persistente
 * @param {() => undefined} on_success A ejecutar si guarda correctamente
 * @param {() => undefined} on_error A ejecutar si no puede guardar
 */
FilmManager.prototype.save = function(on_success = () => {}, on_error = () => {}) {
    console.log("Guardando la lista...")
    lista = {
        "pelis": this.dict
    }
    fs.writeFile(LISTA_LOCATION, JSON.stringify(lista), function(err) {
        if (err) {
            console.error(err)
            on_error()
        } else {
            console.log("Guardada la lista en disco.")
            on_success()
        }
    })
}


/**
 * Carga las pelis guardadas en ~La Lista~ para que el bot las tenga disponibles
 * @param {() => undefined} on_success A ejecutar si carga correctamente
 * @param {() => undefined} on_error A ejecutar si no puede cargar
 */
FilmManager.prototype.load = function(on_success = () => {}, on_error = () => {}) {
    console.log("Cargando la lista...")
    let this_instance = this
    fs.readFile(LISTA_LOCATION, "utf8", function(err, data) {
        if(err) {
            console.error(err)
            on_error()
        } else {
            try {
                parsed_data = JSON.parse(data)
                this_instance.dict = parsed_data.pelis
                console.log("Cargada la lista desde disco.")
                on_success()
            } catch(e) {
                console.error("Error al cargar de disco: " + e)
                on_error()
            }
        }
    })
}


module.exports = { FilmManager }
