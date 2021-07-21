const { readdirSync } = require('fs');

class Backend {
    constructor() {
        this.express = require('express');
        this.fs = require('fs');
        this.moment = require('moment');
        this.Client = require('fnbr').Client;
        this.axios = require('axios').default;
        this.resolve = require('path').resolve;

        this.server = this.express();
        this.path = this.resolve(`${__dirname}`);

        const Logger = require(`${this.path}/util/Logger`);

        this.config = require(`${this.path}/../config`);
        this.errorCodes = require(`${this.path}/resources/errorCodes`);
        this.logger = new Logger(this);
        this.port = this.config.port || 8080;
    }

    loadRoutes(path) {
        readdirSync(this.resolve(`${this.path}/${path}`)).forEach(dir => {
            const routes = readdirSync(this.resolve(`${this.path}/${path}/${dir}`));

            if (dir === 'client' || dir === 'party') {
                for (const route of routes) {
                    const file = require(this.resolve(`${this.path}/${path}/${dir}/${route}`));
                    const endpoint = `/api/${dir}/${route.split('.')[0]}`;
    
                    this.server.get(endpoint, file.bind(null, this));
                }
            } else {
                for (const route of routes) {
                    let endpoint;

                    switch (route) {
                        case 'index.html': endpoint = '/'; break;
                        case 'dashboard.html': endpoint = '/dash'; break;
                        case 'get-started.html': endpoint = '/get-started'; break;
                        default: endpoint = `/public/${route.split('.')[1]}/${route}`; break;
                    }
                    
                    if (route === 'index.html') {
                        this.server.get('/', (req, res) => {
                            res.sendFile(this.resolve(`${this.path}/${path}/${dir}/${route}`));
                        });
                    } else {
                        this.server.get(endpoint, (req, res) => {
                            res.sendFile(this.resolve(`${this.path}/${path}/${dir}/${route}`));
                        });;
                    }
                }
            }
        });
    }

    init() {
        process.on('unhandledRejection', error => {
            this.logger.error(error) 
        });

        this.loadRoutes('./routes');

        this.server.listen(this.port, async () => {
            this.logger.info(`Server is listening at localhost:${this.port}`);
            this.cosmetics = await (await this.axios.get('https://fortnite-api.com/v2/cosmetics/br')).data.data;
            this.logger.info(`${this.cosmetics.length} cosmetics have been loaded.`)
        });
    }
}

const backend = new Backend();
backend.init();