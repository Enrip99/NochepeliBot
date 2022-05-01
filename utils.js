

//TODO: Igual quitar aquí la puntuación del título???
/**
 * Función auxiliar para estandarizar la sanitización de los nombres de las pelis
 */
function sanitize_movie_name(movie_name) {
    return movie_name.trim().toLowerCase();
}


/**
 * Extrae el nombre de la peli del mensaje, asumiendo que el mensaje está en formato
 * <comando> <nombre de la peli>
 */
function parse_movie_name(text) {
    splitted_text = text.split(' ')
    splitted_text.shift()
    return splitted_text.join(' ')
}

module.exports = { sanitize_movie_name, parse_movie_name }