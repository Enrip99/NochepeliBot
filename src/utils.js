
//TODO: Igual quitar aquí la puntuación del título???
/**
 * Función auxiliar para estandarizar la sanitización de los nombres de las pelis
 */
exports.sanitize_film_name = function(film_name) {
    let regex = /(\W*)(\w*)*?/gm
    let ret = film_name.trim().replace(regex, "$2").toLowerCase()
    if(!ret) {
        ret = "_"
    }
    return ret
}


/**
 * Extrae el nombre de la peli del mensaje, asumiendo que el mensaje está en formato
 * \<comando\> \<nombre de la peli\>
 */
exports.parse_film_name = function(text) {
    splitted_text = text.split(' ')
    splitted_text.shift()
    return splitted_text.join(' ')
}


/**
 * Devuelve un objeto User en base a un id. Es necesario pasar una referencia
 * al bot. Devuelve una promesa, por lo que hay que usar await o .then() para
 * obtener el objeto.
 */
exports.get_user_by_id = async function(client, id) {
    return client.users.fetch(String(id))
}


/**
 * Elimina de la lista la primera ocurrencia del objeto indicado
 * @param {*} list Lista de la que borrar el objeto
 * @param {*} item El objeto a borrar
 */
exports.remove_from_list = function(list, item) {
    ret = list.includes(item)
    if(ret) {
        list.splice(list.indexOf(item), 1)
    }
    return ret
}


/**
 * Devuelve un elemento aleatorio de la lista
 */
exports.random_from_list = function(list) {
    return list[Math.floor(Math.random() * list.length)]
}
