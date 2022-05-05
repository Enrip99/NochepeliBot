

class Message {

    constructor(channel_id, message_id) {
        this.channel_id = channel_id
        this.message_id = message_id
    }

    
    static from(message) {
        return new Message(message.channelId, message.id)
    }


    async fetch(client) {
        let ret = null
        try {
            let channel = await client.channels.fetch(this.channel_id)
            let message = await channel.messages.fetch(this.message_id)
            ret = message
        } catch(e) {
            console.error(`No se ha podido fetchear ${this}: ${e}`)
        }
        return ret
    }


    async edit(client, edit_parameters) {
        let fetched = await this.fetch(client)
        fetched.edit(edit_parameters)
    }


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