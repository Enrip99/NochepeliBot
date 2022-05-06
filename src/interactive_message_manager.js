const utils = require("./utils.js")
const config = require("../data/config.json")
const { InteractiveMessage, DeciduousInteractiveMessage } = require("./interactive_message.js")


class InteractiveMessageManager {

    /** @type {InteractiveMessageManager} */
    static instance
    /** @type {{[type :string]: {[id :string]: DeciduousInteractiveMessage}}} */
    deciduous_messages
    /**
     * @typedef {import("discord.js").Snowflake} Snowflake
     * @typedef {new (channel_id :Snowflake, message_id :Snowflake) => InteractiveMessage} MessageConstructor
     * @type {{[id :string]: MessageConstructor}}
     */
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
     * @param {MessageConstructor} type
     */
    register_type(unique_id, type) {
        this.message_types[unique_id] = type
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
     * @param {import("discord.js").ButtonInteraction} interaction
     */
    async process(interaction) {
        if(!interaction.isButton() || interaction.guildId != config.guildId) {
            return
        }

        interaction.deferUpdate()

        let {deciduousity, type, customId, args} = utils.button_customId_parser(interaction.customId)

        switch(deciduousity) {
            case "IM":
                let message_instance = new this.message_types[type](interaction.channelId, interaction.message.id)
                message_instance.on_update(message_instance, customId, args)
                break
            case "DM":
                for(let id of Object.keys(this.deciduous_messages[type])) {
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
        for(let ctor of Object.keys(this.deciduous_messages)) {
            for(let msg of Object.keys(this.deciduous_messages[ctor])) {
                yield this.deciduous_messages[ctor][msg]
            }
        }
    }
}



InteractiveMessageManager.instance = new InteractiveMessageManager()

module.exports = { InteractiveMessageManager }