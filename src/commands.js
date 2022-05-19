const fs = require("fs")

/**
 * @typedef {Omit<import("@discordjs/builders").SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">} CommandData
 * @typedef {(interaction :import("discord.js").CommandInteraction) => Promise<void>} CommandExecution
 * @typedef {{data :CommandData, execute :CommandExecution}} CommandClass
 * */

/** @type {CommandClass[]} */
const command_modules = [
    // GEN-COMMAND START
    require("./commands/add.js"),
    require("./commands/addlink.js"),
    require("./commands/addtag.js"),
    require("./commands/aliases/addalias.js"),
    require("./commands/aliases/getalias.js"),
    require("./commands/aliases/removealias.js"),
    require("./commands/ayuda.js"),
    require("./commands/editname.js"),
    require("./commands/editowner.js"),
    require("./commands/getlink.js"),
    require("./commands/list.js"),
    require("./commands/listall.js"),
    require("./commands/managetags.js"),
    require("./commands/mention.js"),
    require("./commands/ping.js"),
    require("./commands/remove.js"),
    require("./commands/removelink.js"),
    require("./commands/removetag.js"),
    require("./commands/suggest.js"),
    require("./commands/want.js"),
    require("./commands/wantedby.js"),
    require("./commands/whowants.js")
    // GEN-COMMAND END
]

exports.get_command_collection = function() {
    /** @type {{[name :string]: CommandClass}} */
    let ret = {}

    for(let command of command_modules) {
        ret[command.data.name] = command
    }

    return ret
}