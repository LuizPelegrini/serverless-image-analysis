const axios = require('axios');

class Handler {
    constructor({ 
        rekoClient,
        translateClient,
        detectLabelsCommand,
        translateTextCommand
    }){
        this.rekoClient = rekoClient;
        this.translateClient = translateClient;
        this.detectLabelsCommand = detectLabelsCommand;
        this.translateTextCommand = translateTextCommand;
    }

    async detectImageLabels(buffer) {
        const Image = {
            Bytes: buffer
        }
        this.detectLabelsCommand.input.Image = Image;

        const { Labels } = await this.rekoClient.send(this.detectLabelsCommand);
        return Labels;
    }

    async getImageBuffer(imageUrl) {
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });

        const buffer = Buffer.from(response.data, 'base64');
        return buffer;
    }

    async main(event){
        const { imageURL } = event.queryStringParameters;

        try {
            if(!imageURL){
                return {
                    statusCode: 400,
                    body: 'An image url is required'
                };
            }

            console.log('downloading image...');
            const imgBuffer = await this.getImageBuffer(imageURL);
            console.log('detecting image...');
            const labels = await this.detectImageLabels(imgBuffer);
            console.log(labels);

            return {
                statusCode: 200,
                body: 'Hello World!'
            };
        } catch (error) {
            console.error('ERROR::', error.stack);
            return {
                statusCode: 500,
                body: 'Internal Server Error'
            }
        }
        
    }
}

module.exports = Handler;