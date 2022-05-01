

//TODO: Igual quitar aquí la puntuación del título???
/**
 * Función auxiliar para estandarizar la sanitización de los nombres de las pelis
 */
function sanitize_film_name(film_name) {
    return film_name.trim().toLowerCase();
}


/**
 * Extrae el nombre de la peli del mensaje, asumiendo que el mensaje está en formato
 * <comando> <nombre de la peli>
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

module.exports = { sanitize_film_name, parse_film_name, get_user_by_id }