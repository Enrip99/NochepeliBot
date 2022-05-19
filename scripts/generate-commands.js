const fs = require("fs")
const path = require("path")
const { get_all_nested_files } = require("./script-utils.js")


const COMMANDS_DIR = "src/commands"
const COMMANDS_FILE = "src/commands.js"
const PATTERN = "GEN-COMMAND"



let old_commands_file = fs.openSync(COMMANDS_FILE, 'r')
let new_commands_file = fs.openSync(COMMANDS_FILE + '_', 'a')


let command_files = get_all_nested_files(COMMANDS_DIR, path.dirname(COMMANDS_FILE))
const pattern_regex_start = new RegExp(`${PATTERN} START`)
const pattern_regex_end = new RegExp(`${PATTERN} END`)


// Escribe la parte pre-START en el archivo
let old_file_content = fs.readFileSync(old_commands_file, 'utf-8').split('\n')
let current_index = 0
while(current_index < old_file_content.length) {
    let line = old_file_content[current_index]
    current_index++
    fs.writeFileSync(new_commands_file, `${line}\n`)
    if(line.match(pattern_regex_start)) {
        break
    }
}

// Escribe los requires
for(let i = 0; i < command_files.length; i++) {
    let line = `    require("./${command_files[i]}")`
    if(i < command_files.length - 1) {
        line += ','
    }
    fs.writeFileSync(new_commands_file, `${line}\n`)
}

// Salta hasta el final de la parte autogenerada del archivo
while(current_index < old_file_content.length) {
    current_index++
    if(old_file_content[current_index].match(pattern_regex_end)) {
        break
    }
}

// Escribe el resto del archivo
while(current_index < old_file_content.length) {
    let line = old_file_content[current_index]
    let linebreak = ""
    if(current_index < old_file_content.length - 1) {
        linebreak = "\n"
    }
    fs.writeFileSync(new_commands_file, `${line}${linebreak}`)
    current_index++
}


fs.unlinkSync(COMMANDS_FILE)
fs.renameSync(`${COMMANDS_FILE}_`, COMMANDS_FILE)