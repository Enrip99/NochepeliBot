const { Message } = require("./message.js");


class InteractiveMessage extends Message {

    
    equivalent(other) {
        return this.constructor == other.constructor && this.identity().equals(other.identity())
    }


    identity() {
        // To be overriden in subclasses
        return this
    }


    on_add(interaction) {
        // To be overridden in subclasses
    }


    on_update(interaction) {
        // To be overriden in subclasses
    }


    toString() {
        return "[InteractiveMessage : channel " + this.channel_id + ", message " + this.message_id + "]"
    }
}


class DeciduousInteractiveMessage extends InteractiveMessage {


    on_abandon(interaction) {
        // To be overriden in subclasses
    }

}


module.exports = { InteractiveMessage, DeciduousInteractiveMessage }