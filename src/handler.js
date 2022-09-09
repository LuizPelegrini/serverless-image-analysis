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

    async translateText(text) {
        this.translateTextCommand.input.Text = text;
    
        const { TranslatedText } = await this.translateClient.send(this.translateTextCommand);
      
        return TranslatedText;
    }

    constructEnglishText (labels) {
        const text = labels.reduce((acc, elem, currentIndex) => {
            acc += `${elem.Name} with ${elem.Confidence.toFixed(2)}% of confidence`;
    
            if(currentIndex < labels.length - 1){
              acc += ' and '
            } else {
              acc += '.'
            }
    
            return acc;
        }, '');

        return text;
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
        const { queryStringParameters } = event;

        try {
            if(!queryStringParameters || !queryStringParameters.imageURL){
                return {
                    statusCode: 400,
                    body: 'An image url is required'
                };
            }

            console.log('downloading image...');
            const imgBuffer = await this.getImageBuffer(imageURL);
            console.log('detecting image...');
            const labels = await this.detectImageLabels(imgBuffer);
            console.log('translating text...');
            const englishText = this.constructEnglishText(labels);
            const translatedText = await this.translateText(englishText);

            return {
                statusCode: 200,
                body: translatedText
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