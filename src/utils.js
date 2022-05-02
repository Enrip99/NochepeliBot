

//TODO: Igual quitar aquí la puntuación del título???
/**
 * Función auxiliar para estandarizar la sanitización de los nombres de las pelis
 */
function sanitize_film_name(film_name) {
    return film_name.trim().toLowerCase();
}


/**
 * Extrae el nombre de la peli del mensaje, asumiendo que el mensaje está en formato
 * \<comando\> \<nombre de la peli\>
 */
function parse_film_name(text) {
    splitted_text = text.split(' ')
    splitted_text.shift()
    return splitted_text.join(' ')
}


/**
 * Devuelve un objeto User en base a un id. Es necesario pasar una referencia
 * al bot. Devuelve una promesa, por lo que hay que usar await o .then() para
 * obtener el objeto.
 */
async function get_user_by_id(client, id) {
    return client.users.fetch(String(id))
}


/**
 * Elimina de la lista la primera ocurrencia del objeto indicado
 * @param {*} list Lista de la que borrar el objeto
 * @param {*} item El objeto a borrar
 */
function remove_from_list(list, item) {
    ret = list.includes(item)
    if(ret) {
        list.splice(list.indexOf(item), 1)
    }
    return ret
}


module.exports = { sanitize_film_name, parse_film_name, get_user_by_id, remove_from_list }