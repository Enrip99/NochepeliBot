const { TextChannel } = require("discord.js")


class Message {

    /** @type {import("discord.js").Snowflake} */
    channel_id
    /** @type {import("discord.js").Snowflake} */
    message_id

    /**
     * @param {import("discord.js").Snowflake} channel_id 
     * @param {import("discord.js").Snowflake} message_id 
     */
    constructor(channel_id, message_id) {
        this.channel_id = channel_id
        this.message_id = message_id
    }

    /**
     * 
     * @param {import("discord.js").Message} message 
     * @returns 
     */
    static from(message) {
        return new Message(message.channelId, message.id)
    }


    /**
     * 
     * @param {import("discord.js").Client} client 
     * @returns 
     */
    async fetch(client) {
        let ret = null
        try {
            let channel = await client.channels.fetch(this.channel_id)
            if(!channel || !(channel instanceof TextChannel)) {
                console.warn(`Canal con id ${this.channel_id} no encontrado`)
                return null
            }
            let message = await channel.messages.fetch(this.message_id)
            ret = message
        } catch(e) {
            console.error(`No se ha podido fetchear ${this}: ${e}`)
        }
        return ret
    }


    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {string | import("discord.js").MessagePayload | import("discord.js").MessageEditOptions} edit_parameters 
     */
    async edit(client, edit_parameters) {
        let fetched = await this.fetch(client)
        if(fetched) {
            fetched.edit(edit_parameters)
        }
    }


    /** @param {any} other */
    equals(other) {
        return other instanceof Message && this.channel_id === other.channel_id && this.message_id === other.message_id
    }


    toString() {
        return `[Message : channel ${this.channel_id}, message ${this.message_id}]`
    }


    serialize() {
        return {
            channel_id: this.channel_id,
            message_id: this.message_id
        }
    }


    /** @param {any} json */
    static deserialize(json) {
        if(!json) {
            return null
        }
        let ret = null
        try {
            let data = json
            ret = new Message(data.channel_id, data.message_id)
        } catch(e) {
            console.error(`Error al deserializar: ${e} (JSON: ${json})`)
        }
        return ret
    }
}


module.exports = { Message }