const config = require('../data/config.json')
const { TextChannel } = require('discord.js')


/**
 * Función auxiliar para estandarizar la sanitización de los nombres de las pelis
 * @param {string} film_name
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
 * @param {import("discord.js").Client} client,
 * @param {import("discord.js").Snowflake} id
 */
exports.get_user_by_id = async function(client, id) {
    return client.users.fetch(String(id))
}


/**
 * Elimina de la lista la primera ocurrencia del objeto indicado
 * @template {any} T
 * @param {T[]} list Lista de la que borrar el objeto
 * @param {T} item El objeto a borrar
 */
exports.remove_from_list = function(list, item) {
    let ret = list.includes(item)
    if(ret) {
        list.splice(list.indexOf(item), 1)
    }
    return ret
}

/**
 * Devuelve un elemento aleatorio de la lista
 * @template {any} T
 * @param {T[]} list
 * @param {number[]?} weights
 */
exports.random_from_list = function(list, weights = null) {
    if(!weights) {
        return list[Math.floor(Math.random() * list.length)]
    } else {
        if(list.length != weights.length) {
            throw new Error("La lista de pesos tiene que tener el mismo tamaño que la lista principal")
            
        }
        let total_weight = weights.reduce((a, b) => a + b)
        if(total_weight <= 0) {
            throw new Error("No se puede obtener elementos aleatorios con un peso total de 0 o negativo")
        }
        let selected_value = Math.random() * total_weight
        let cum_value = 0
        for(let i = 0; i < list.length; i++) {
            cum_value += weights[i]
            if(cum_value > selected_value) {
                return list[i]
            }
        }
        throw new Error(`No se ha podido obtener un valor de la lista ${list} con pesos=${weights} selected_value=${selected_value}`)
    }
}

/**
 * Itera por todos los elementos de la lista en paralelo
 * @template {any} T
 * @param {Iterable<T>} list El Iterable™ por la que iterar
 * @param {(current :T) => Promise<void>} lambda La función a realizar sobre cada elemento de la lista
 * @returns Una promesa que se cumple cuando todas las iteraciones se hayan realizado
 */
exports.parallel_for = async function(list, lambda) {   
    let promises = []
    for(let item of list) {
        promises.push(new Promise((resolve, reject) => {
            lambda(item).then(resolve)
        }))
    }
    return Promise.all(promises)
}

/**
 * lmao
 * @typedef {string | number | symbol} K
 * @typedef {string | number | symbol} V
 * @param {{[key :K]: V}} dict
 * @returns
 */
exports.reverse_dictionary = function(dict) {
    /** @type {{[key :V]: K}} */
    let ret = {}
    for(let key of Object.keys(dict)) {
        let value = dict[key]
        if(value in ret) {
            console.warn(`Value '${value.toString()}' is duplicated`)
        }
        ret[value] = key
    }
    return ret
}


/**
 * 
 * @param {string} raw_customId 
 * @returns 
 */
exports.button_customId_parser = function(raw_customId) {
    let fields = raw_customId.split(":")
    if(fields.length < 3) {
        console.warn("Unexpected customId arg length")
    }
    let deciduous = fields[0] == "DM"
    let type = fields[1]
    let args = fields.slice(2) // Si no existe, devuelve []
    return {deciduous, type, args}
}


/**
 * 
 * @param {boolean} deciduous
 * @param {string} type 
 * @param {string} customId 
 * @param {string[]} args 
 * @returns 
 */
exports.button_customId_maker = function(deciduous, type, customId, args = []) {
    let deciduousity = deciduous ? "DM" : "IM"
    let split_args = customId.split(":").concat(args).join(":")
    let ret = `${deciduousity}:${type}`
    return [ret, split_args].join(":")
}

/**
 * 
 * @param  {...{toString :() => string}} args 
 */
exports.list_as_readable_text = function(...args) {
    let ret = ""
    for(let i = 0; i < args.length; i++) {
        ret += args[i].toString()
        if(i == args.length - 2) {
            ret += " y "
        } else if(i < args.length - 1) {
            ret += ", "
        }
    }
    return ret
}

/**
 * 
 * @param {number} number 
 * @param {'m' | 'f'} gender
 */
exports.numbers_as_text = function(number, gender = "f") {
    const names = ["cero", gender == 'f' ? "una" : "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"]
    if(number >= names.length || number < 0) {
        return number.toString()
    } else {
        return names[number]
    }
}


/**
 * Apaga el bot
 * @param {import("discord.js").Client} client Referencia al cliente del bot
 */
exports.shut_down = async function(client) {
    // TODO Con la nueva versión de la API, process.exit() tendría que ir después de esperar al mensaje (await o then)
    let channel = await client.channels.fetch(config.channelId)
    if(!channel || !(channel instanceof TextChannel)) {
        console.warn(`Canal de texto con id ${config.channelId} no encontrado`)
        return
    }
    channel.send(exports.random_from_list(['adios', 'buenas noches', 'bona nit', 'que os jodan']));
    console.log('Apagando...');
    setTimeout(() => process.exit(), 200);
}


/**
 *  Hey guys, did you know that in terms of male human and female Pokémon breeding, Vaporeon is the most compatible Pokémon for humans? Not only are they in the field egg group, which is mostly comprised of mammals, Vaporeon are an average of 3”03’ tall and 63.9 pounds, this means they’re large enough to be able handle human dicks, and with their impressive Base Stats for HP and access to Acid Armor, you can be rough with one. Due to their mostly water based biology, there’s no doubt in my mind that an aroused Vaporeon would be incredibly wet, so wet that you could easily have sex with one for hours without getting sore. They can also learn the moves Attract, Baby-Doll Eyes, Captivate, Charm, and Tail Whip, along with not having fur to hide nipples, so it’d be incredibly easy for one to get you in the mood. With their abilities Water Absorb and Hydration, they can easily recover from fatigue with enough water. No other Pokémon comes close to this level of compatibility. Also, fun fact, if you pull out enough, you can make your Vaporeon turn white. Vaporeon is literally built for human dick. Ungodly defense stat+high HP pool+Acid Armor means it can take cock all day, all shapes and sizes and still come for more
 *  @param {string} my_string 
*/
exports.vaporeon_check = function(my_string) {
	let regex = /\bvaporeon\b/gmi
	let ret = null
	if(my_string.match(regex)) {
        ret = exports.random_from_list(
			["jaja qué gracioso", "comedy heaven", "me parto los cojones /s", "la comedia fue hecha",
			"Hey guys, did you know that in terms of human companionship, Flareon is objectively the most huggable Pokemon? While their maximum temperature is likely too much for most, they are capable of controlling it, so they can set themselves to the perfect temperature for you. Along with that, they have a lot of fluff, making them undeniably incredibly soft to touch. But that's not all, they have a very respectable special defense stat of 110, which means that they are likely very calm and resistant to emotional damage. Because of this, if you have a bad day, you can vent to it while hugging it, and it won't mind. It can make itself even more endearing with moves like Charm and Baby Doll Eyes, ensuring that you never have a prolonged bout of depression ever again.",
			"lol", "ok", "ratio"]) 
            //La cadena es verdaderosa
	}
	return ret
}

/**
 *  No, pero me gustaría verlas.
 *  @param {string} my_string 
*/
exports.mistetas_check = function(my_string) {
	let regex = /\bmistetas\b/gmi
	let ret = null
	if(my_string.match(regex)) {
        ret = exports.random_from_list(
            ["No, pero me gustaría verlas."]) 
            //La cadena es verdaderosa
	}
	return ret
}

