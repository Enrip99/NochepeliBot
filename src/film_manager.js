const fs = require('fs');
const utils = require('./utils.js')
const Film = require ('./utils.js').Film

const LISTA_LOCATION = "../data/lista.json"


FilmManager = function() {
    this.dict = {}
}

/**
 * Añade una peli a la lista
 * @param {string} film_name El nombre de la peli, sin sanitizar
 * @param {int} proposed_by_user El id del usuario que la ha propuesto
 * @returns Si la película ha sido añadida por primera vez
 */
FilmManager.add = function(film_name, proposed_by_user) {
    sanitized_name = utils.sanitize_film_name(film_name)
    ret = sanitized_name in this.dict
    this.dict[sanitized_name] = new Film(film_name, proposed_by_user)
    return !ret
}

/**
 * Quita una peli de la lista
 * @param {string} film_name El nombre de la peli, sin sanitizar
 * @returns Si la película existía antes de quitarla
 */
FilmManager.remove = function(film_name) {
    film_name = utils.sanitize_film_name(film_name)
    return delete this.dict[film_name]
}


/**
 * Devuelve una peli, si existe. En caso contrario devuelve `null`
 * @param {string} film_name El nombre de la peli, sin sanitizar
 * @returns El objeto que representa la peli o `null`
 */
FilmManager.get = function(film_name) {
    film_name = utils.sanitize_film_name(film_name)
    return this.dict[film_name] ?? null
}


/**
 * Indica si hay una peli registrada con ese nombre
 * @param {string} film_name El nombre de la peli, sin sanitizar
 * @returns Si la peli existe o no
 */
FilmManager.exists = function(film_name) {
    film_name = utils.sanitize_film_name(film_name)
    return film_name in this.dict
}


/**
 * Escribe las pelis del bot en ~La Lista~ para que sea persistente
 */
FilmManager.save = function() {
    fs.writeFile(LISTA_LOCATION, JSON.stringify(lista), function(err) {
        if (err) {
            console.error(err)
        } else {
            console.log("Guardada la lista en disco.")
        }
    })
}


/**
 * Carga las pelis guardadas en ~La Lista~ para que el bot las tenga disponibles
 */
FilmManager.load = function() {
    fs.readFile(LISTA_LOCATION, "utf8", function(err, data) {
        if(err) {
            console.error(err)
        } else {
            try {
                this.list = JSON.parse(data)
                console.log("Cargada la lista desde disco.")
            } catch(e) {
                console.error("Error al cargar de disco: " + e)
            }
        }
    })
}


module.exports = { FilmManager }