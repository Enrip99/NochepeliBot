const config = require('../data/config.json')
const { MessageEmbed } = require('discord.js')


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
    let channel = await client.channels.fetch(config.channelId)
    channel.send(exports.random_from_list(['adios', 'buenas noches', 'bona nit', 'que os jodan']));
    console.log('Apagando...');
    setTimeout(() => process.exit(), 200);
}


/**
 *  Hey guys, did you know that in terms of male human and female Pokémon breeding, Vaporeon is the most compatible Pokémon for humans? Not only are they in the field egg group, which is mostly comprised of mammals, Vaporeon are an average of 3”03’ tall and 63.9 pounds, this means they’re large enough to be able handle human dicks, and with their impressive Base Stats for HP and access to Acid Armor, you can be rough with one. Due to their mostly water based biology, there’s no doubt in my mind that an aroused Vaporeon would be incredibly wet, so wet that you could easily have sex with one for hours without getting sore. They can also learn the moves Attract, Baby-Doll Eyes, Captivate, Charm, and Tail Whip, along with not having fur to hide nipples, so it’d be incredibly easy for one to get you in the mood. With their abilities Water Absorb and Hydration, they can easily recover from fatigue with enough water. No other Pokémon comes close to this level of compatibility. Also, fun fact, if you pull out enough, you can make your Vaporeon turn white. Vaporeon is literally built for human dick. Ungodly defense stat+high HP pool+Acid Armor means it can take cock all day, all shapes and sizes and still come for more
 */
exports.vaporeon_check = function(my_string) {
	let regex = /\bvaporeon\b/gmi
	let ret = false
	if(my_string.match(regex)) {
        ret = exports.random_from_list(
			["jaja qué gracioso", "comedy heaven", "me parto los cojones /s", "la comedia fue hecha",
			"Hey guys, did you know that in terms of human companionship, Flareon is objectively the most huggable Pokemon? While their maximum temperature is likely too much for most, they are capable of controlling it, so they can set themselves to the perfect temperature for you. Along with that, they have a lot of fluff, making them undeniably incredibly soft to touch. But that's not all, they have a very respectable special defense stat of 110, which means that they are likely very calm and resistant to emotional damage. Because of this, if you have a bad day, you can vent to it while hugging it, and it won't mind. It can make itself even more endearing with moves like Charm and Baby Doll Eyes, ensuring that you never have a prolonged bout of depression ever again.",
			"lol", "ok", "ratio"]) 
            //La cadena es verdaderosa
	}
	return ret
}

