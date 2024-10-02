const { v4: uuidv4 } = require('uuid');
console.log(uuidv4());

class Band {
    constructor(name = 'no name') {
        this.id = uuidv4()
        this.name = name
        this.votes = 0
    }
}

module.exports = Band