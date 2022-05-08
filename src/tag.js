const utils = require("./utils.js")

class Tag {

    /** @type {string} */
    tag_name
    /** @type {string} */
    sanitized_name
    /** @type {boolean} */
    hidden


    /**
     * 
     * @param {string} tag_name 
     */
    constructor(tag_name) {
        this.tag_name = tag_name
        this.sanitized_name = utils.sanitize_film_name(tag_name)
        this.hidden = false
    }

    // TODO: Terminar esta clase
}

module.exports = { Tag }