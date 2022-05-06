const utils = require("./utils.js")
const config = require("../data/config.json")
const { InteractiveMessage, DeciduousInteractiveMessage } = require("./interactive_message.js")
const { Message } = require("./message.js")


class InteractiveMessageManager {

    /** @type {InteractiveMessageManager} */
    static instance
    /** @type {{[type :string]: {[id :string]: DeciduousInteractiveMessage}}} */
    deciduous_messages
    /** @type {{[id :string]: string}} */
    message_types
    /** @type {import("discord.js").Client} */
    client


    constructor() {
        this.deciduous_messages = {}
        this.message_types = {}
        this.client = null
    }


    /**
     * @param {import("discord.js").Client} client
     */
    register(client) {
        this.client = client
        client.on("interactionCreate", this.process)
    }


    /**
     * @param {string} unique_id,
     * @param {string} type
     */
    register_type(unique_id, type) {
        this.message_types[unique_id] = type
        // type.unique_id = unique_id
        //TODO A ver qué hacemos aquí
    }


    /**
     * 
     * @param {InteractiveMessage} message
     * @param {import("discord.js").CommandInteraction} interaction
     */
    add(message, interaction) {
        if(message instanceof DeciduousInteractiveMessage) {
            if(message.constructor.name in this.deciduous_messages) {
                this.deciduous_messages[message.constructor.name] = {}
            }
            if(message.identity() in this.deciduous_messages[message.constructor.name]) {
                this.abandon(this.deciduous_messages[message.constructor.name][message.identity()], interaction)
            }
            this.deciduous_messages[message.constructor.name][message.identity()] = message
        }
        message.on_add(interaction)
    }


    /**
     * 
     * @param {DeciduousInteractiveMessage} message
     * @param {import("discord.js").CommandInteraction} interaction
     */
    abandon(message, interaction) {
        if(!(message instanceof DeciduousInteractiveMessage)) {
            return
        }
        if(!(message.constructor.name in this.deciduous_messages)) {
            return
        }
        if(!(message.identity() in this.deciduous_messages[message.constructor.name])) {
            return
        }
        delete this.deciduous_messages[message.constructor.name][message.identity()]
        message.on_abandon(interaction)
    }


    /**
     * 
     * @param {import("discord.js").Interaction} interaction
     */
    async process(interaction) {
        //TODO Tendría que ser una interacción de tipo ButtonInteraction
        if(!interaction.isButton() || interaction.guildId != config.guildId) {
            return
        }

        interaction.deferUpdate()

        let {deciduousity, type, individual_customId, args} = utils.button_customId_parser(this.message_types, interaction.customId)

        switch(deciduousity) {
            case "IM":
                //TODO ¿Aquí qué hacemos?
                let message_instance = new Message(interaction.channelId, interaction.message.id)
                //message_instance.on_update(message_instance, customId, args)
                break
            case "DM":
                for(let id of Object.keys(this.deciduous_messages[type])) {
                    let message_instance = this.deciduous_messages[type][id]
                    message_instance.on_update(message_instance, individual_customId, args)
                    break
                }
                break
            default:
                console.error("Invalid Deciduousity. Must be either 'IM' (perennial) or 'DM' (deciduous).")
        }   
    }


    *iterate() {
        for(let ctor of Object.keys(this.deciduous_messages)) {
            for(let msg of Object.keys(this.deciduous_messages[ctor])) {
                yield this.deciduous_messages[ctor][msg]
            }
        }
    }
}



InteractiveMessageManager.instance = new InteractiveMessageManager()

module.exports = { InteractiveMessageManager }