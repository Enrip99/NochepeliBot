const fs = require("fs")
const path = require("path")


const COMMANDS_DIR = "src/commands"
const COMMANDS_FILE = "src/commands.js"
const PATTERN = "GEN-COMMAND"



let old_commands_file = fs.openSync(COMMANDS_FILE, 'r')
let new_commands_file = fs.openSync(COMMANDS_FILE + '_', 'a')

/**
 * 
 * @param {string} directory 
 */
function get_all_nested_files(directory, relative_to = null) {
    let files = fs.readdirSync(directory)
    /** @type {string[]} */
    let ret = []
    for(let file of files) {
        let joined_file = path.join(directory, file)
        let file_stats = fs.statSync(joined_file)
        if(file_stats.isDirectory()) {
            ret = ret.concat(get_all_nested_files(joined_file, relative_to))
        } else {
            if(relative_to) {
                ret.push(path.relative(relative_to, joined_file))
            }
        }
    }
    return ret
}


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
    fs.writeFileSync(new_commands_file, `${line}\n`)
    current_index++
}


fs.unlinkSync(COMMANDS_FILE)
fs.renameSync(`${COMMANDS_FILE}_`, COMMANDS_FILE)