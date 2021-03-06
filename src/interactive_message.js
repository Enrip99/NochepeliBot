const { Message } = require("./message.js");
const utils = require("./utils.js")


class InteractiveMessage extends Message {

    
    /**
     * 
     * @returns {import("discord.js").MessageActionRow[]}
     */
    create_buttons(){
        
        let action_rows = this.buttons_to_create()
        let deciduous = this instanceof DeciduousInteractiveMessage
        for(let row of action_rows) {
            for(let component of row.components) {
                component.setCustomId(utils.button_customId_maker(deciduous, this.constructor.name, component.customId))
            }
        }
        return action_rows
    }
    

    /**
     * 
     * @returns {import("discord.js").MessageActionRow[]}
     */
    buttons_to_create() {
        return []
    }


    /**
     * 
     * @param {string[]} args 
     */
    parse_args(...args) {
        // To be overriden in subclasses
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
     * @param {import("discord.js").ButtonInteraction} interaction
     * @param {string[]} args 
     */
    on_update(interaction, args) {
        // To be overriden in subclasses
    }


    toString() {
        return `[InteractiveMessage : channel ${this.channel_id}, message ${this.message_id}]`
    }
}


class DeciduousInteractiveMessage extends InteractiveMessage {


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
     * @returns {string}
     */
     stringify_args() {
        // To be overriden in subclasses
        return ""
    }


    /**
     * 
     * @param {import("discord.js").Interaction} interaction 
     */
    on_abandon(interaction) {
        // To be overriden in subclasses
    }


    should_be_kept() {
        // To be overriden in subclasses
        return false;
    }


    serialize() {
        let ret = {
            ...super.serialize(),
            arguments: this.stringify_args()
        }
        return ret
    }


    /**
     * @typedef {new (channel_id :string, message_id :string) => DeciduousInteractiveMessage} MessageConstructor
     * @param {any} json
     * @param {MessageConstructor?} ctor
     */
    static deserialize(json, ctor = null) {
        let ret
        if(!ctor) {
            ctor = DeciduousInteractiveMessage
        }
        ret = new ctor(json.channel_id, json.message_id)
        ret.parse_args(...json.arguments.split(":"))
        return ret
    }
}


module.exports = { InteractiveMessage, DeciduousInteractiveMessage }