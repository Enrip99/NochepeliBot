const fs = require("fs")
const path = require("path")


/**
 * 
 * @param {string} directory 
 */
exports.get_all_nested_files = function(directory, relative_to = null) {
    let files = fs.readdirSync(directory)
    /** @type {string[]} */
    let ret = []
    for(let file of files) {
        let joined_file = path.join(directory, file)
        let file_stats = fs.statSync(joined_file)
        if(file_stats.isDirectory()) {
            ret = ret.concat(exports.get_all_nested_files(joined_file, relative_to))
        } else {
            if(relative_to) {
                ret.push(path.relative(relative_to, joined_file))
            } else {
                ret.push(joined_file)
            }
        }
    }
    return ret
}