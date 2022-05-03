const config = require('../data/config.json')


/**
 * Función auxiliar para estandarizar la sanitización de los nombres de las pelis
 */
exports.sanitize_film_name = function(film_name) {
    let diacritic_regex = /\p{Diacritic}/gu
    let alphanumeric_regex = /(\W*)(\w*)*?/gm
    let ret = film_name
        .trim()
        .normalize("NFD")
        .replace(diacritic_regex, "")
        .replace(alphanumeric_regex, "$2")
        .toLowerCase()
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

/**
 * Itera por todos los elementos de la lista en paralelo
 * @param {list} list La lista por la que iterar
 * @param {(*) => Promise<void>} lambda La función a realizar sobre cada elemento de la lista
 * @returns Una promesa que se cumple cuando todas las iteraciones se hayan realizado
 */
exports.parallel_for = async function(list, lambda) {   
    let promises = []
    for(let item of list) {
        promises.push(new Promise((resolve, reject) => {
            lambda(item)
            resolve()
        }))
    }
    return Promise.all(promises)
}


/**
 * Apaga el bot
 * @param {DiscordClient} client Referencia al cliente del bot
 */
exports.shut_down = async function(client) {
    // TODO Con la nueva versión de la API, process.exit() tendría que ir después de esperar al mensaje (await o then)
    let channel = await client.channels.fetch(config.channelid)
    channel.send(exports.random_from_list(['adios', 'buenas noches', 'bona nit', 'que os jodan']));
    console.log('Apagando...');
    setTimeout(() => process.exit(), 200);
}