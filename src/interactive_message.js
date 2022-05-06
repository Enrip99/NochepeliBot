const { Message } = require("./message.js");


class InteractiveMessage extends Message {

    /**
     * 
     * @param {any} other 
     * @returns 
     */
    equivalent(other) {
        return this.constructor == other.constructor && this.identity() == other.identity()
    }


    identity() {
        // To be overriden in subclasses
        return this.toString()
    }


    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     */
    on_add(interaction) {
        // To be overridden in subclasses
    }


    /**
     * 
     * @param {this} message_instance 
     * @param {string} customId 
     * @param {string[]} args 
     */
    on_update(message_instance, customId, args) {
        // To be overriden in subclasses
    }


    toString() {
        return `[InteractiveMessage : channel ${this.channel_id}, message ${this.message_id}]`
    }
}


class DeciduousInteractiveMessage extends InteractiveMessage {

    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     */
    on_abandon(interaction) {
        // To be overriden in subclasses
    }

}


module.exports = { InteractiveMessage, DeciduousInteractiveMessage }