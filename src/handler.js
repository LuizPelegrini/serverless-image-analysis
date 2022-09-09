class Handler {
    constructor({ rekoClient, translateClient }){
        this.rekoClient = rekoClient;
        this.translateClient = translateClient
    }

    async main(event){
        console.log(event);

        return {
            statusCode: 200,
            body: 'Hello World!'
        };
    }
}

module.exports = Handler;