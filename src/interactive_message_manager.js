const utils = require("./utils.js")
const config = require("../data/config.json")
const { InteractiveMessage, DeciduousInteractiveMessage } = require("./interactive_message.js")
const utils = require("./utils.js")


class InteractiveMessageManager {

    static instance

    constructor() {
        this.deciduous_messages = {}
        this.message_types = {}
        this.client = null
    }


    register(client) {
        this.client = client
        client.on("interactionCreate", this.process)
    }


    register_type(unique_id, type) {
        this.message_types[unique_id] = type
        type.unique_id = unique_id
    }


    add(message) {
        if(message instanceof DeciduousInteractiveMessage) {
            if(!(message.constructor in this.deciduous_messages)) {
                this.messages[message.constructor] = {}
            }
            if(message.identity() in this.deciduous_messages[message.constructor]) {
                this.abandon(this.messages[message.constructor])
            }
            this.messages.push(message)
        }
        message.on_add()
    }


    abandon(message) {
        if(!(message instanceof DeciduousInteractiveMessage)) {
            return
        }
        if(!(message.constructor in this.messages)) {
            return
        }
        if(!(message.identity() in this.messages[message.constructor])) {
            return
        }
        delete this.deciduous_messages[message.constructor]
        message.on_abandon()
    }


    async process(interaction) {
        if(!interaction.isButton() || interaction.guildId != config.guildId) {
            return
        }

        interaction.deferUpdate()

        let [deciduousity, type, customId, args] = utils.button_customId_parser(this.message_types, interaction.customId)

        switch(deciduousity) {
            case "IM":
                let message_instance = new type.constructor(interaction.channelId, interaction.message.id)
                message_instance.on_update(message_instance, customId, args)
                break
            case "DM":
                for(let id of this.deciduous_messages[type]) {
                    let message_instance = this.deciduous_messages[type][id]
                    message_instance.on_update(message_instance, customId, args)
                    break
                }
                break
            default:
                console.error("Invalid Deciduousity. Must be either 'IM' (perennial) or 'DM' (deciduous).")
        }   
    }


    *iterate() {
        for(let ctor of Object.keys(this.messages)) {
            for(let msg of this.messages[ctor]) {
                yield msg
            }
        }
    }
}



InteractiveMessageManager.instance = new InteractiveMessageManager()

module.exports = { InteractiveMessageManager }