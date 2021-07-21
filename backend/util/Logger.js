class Logger {
    constructor(backend) {
        this.backend = backend;
    }

    info(content) {
        console.log(`[${this.backend.moment().format('lll')}] [INFO]`, content)
    }

    error(content) {
        console.log(`[${this.backend.moment().format('lll')}] [ERROR]`, content)
    }
}

module.exports = Logger;