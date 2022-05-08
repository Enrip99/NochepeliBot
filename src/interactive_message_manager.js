const utils = require("./utils.js")
const config = require("../data/config.json")
const { InteractiveMessage, DeciduousInteractiveMessage } = require("./interactive_message.js")
const { Message } = require("./message.js")
const DiscordMessage = require("discord.js").Message


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
        let this_instance = this
        client.on("interactionCreate", (interaction) => this.process.call(this_instance, interaction))
    }


    /**
     * @param {MessageConstructor} type
     */
    register_type(type) {
        this.message_types[type.name] = type
    }


    /**
     * 
     * @param {InteractiveMessage} message
     * @param {import("discord.js").CommandInteraction} interaction
     */
    add(message, interaction) {
        if(!(message.constructor.name in this.message_types)) {
            console.warn(`El tipo ${message.constructor.name} no está registrado en el Manager`)
        }

        if(message instanceof DeciduousInteractiveMessage) {
            if(!(message.constructor.name in this.deciduous_messages)) {
                this.deciduous_messages[message.constructor.name] = {}
            }
            if(message.identity() in this.deciduous_messages[message.constructor.name]) {
                this.abandon(this.deciduous_messages[message.constructor.name][message.identity()], interaction)
            }
            this.deciduous_messages[message.constructor.name][message.identity()] = message
        }

        let action_rows = message.create_buttons()

        message.edit(interaction.client, { components: action_rows })
        .then(() => message.on_add(interaction))
    }


    /**
     * 
     * @param {DeciduousInteractiveMessage} message
     * @param {import("discord.js").Interaction} interaction
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
        if(!interaction.isButton() || interaction.guildId != config.guildId) {
            return
        }

        let {deciduous, type, args} = utils.button_customId_parser(interaction.customId)
        if(!(type in this.message_types)) {
            console.warn(`El tipo ${type} no está registrado en el Manager`)
        }

        if(!deciduous) {
            let message_instance = new this.message_types[type](interaction.channelId, interaction.message.id)
            message_instance.parse_args(...args)
            message_instance.on_update(interaction, args)
        }
        else {
            if(!(interaction.message instanceof DiscordMessage)) return
            for(let id of Object.keys(this.deciduous_messages[type])) {
               let current_msg = this.deciduous_messages[type][id]
               if(current_msg.equals(Message.from(interaction.message))) {
                   current_msg.on_update(interaction, args)
                   if(!current_msg.should_be_kept()) {
                       this.abandon(current_msg, interaction)
                    }
                    break
               }
            }
        }  
    }


    *iterate() {
        for(let ctor of Object.keys(this.deciduous_messages)) {
            for(let msg of Object.keys(this.deciduous_messages[ctor])) {
                yield this.deciduous_messages[ctor][msg]
            }
        }
    }


    serialize() {
        /** @type {any} */
        let ret = {}
        for(let type of Object.keys(this.deciduous_messages)) {
            ret[type] = {}
            for(let id of Object.keys(this.deciduous_messages[type])) {
                if(this.deciduous_messages[type][id].should_be_kept()) {
                    ret[type][id] = this.deciduous_messages[type][id].serialize()
                }
            }
        }
        return ret
    }


    /**
     * 
     * @param {any} json
     */
    load_messages(json) {
        for(let type of Object.keys(json)) {
            if(!(type in this.deciduous_messages)) {
                this.deciduous_messages[type] = {}
            }
            for(let id of Object.keys(json[type])) {
                /* @ts-ignore */
                let msg = DeciduousInteractiveMessage.deserialize(json[type][id], this.message_types[type])
                this.deciduous_messages[type][id] = msg
            }
        }
    }

}



InteractiveMessageManager.instance = new InteractiveMessageManager()

module.exports = { InteractiveMessageManager }