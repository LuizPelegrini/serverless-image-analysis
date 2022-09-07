'use strict'

const { RekognitionClient, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");
const { TranslateClient, TranslateTextCommand } = require('@aws-sdk/client-translate');
const axios = require('axios');

class Handler {
  constructor({ rekoClient, translateClient }){
    this.rekoClient = rekoClient;
    this.translateClient = translateClient;
  }

  async detectImageLabels(buffer) {
    // create command to detect image details
    const detectLabelsCommand = new DetectLabelsCommand({
      Image: {
        Bytes: buffer
      },
      MaxLabels: 3
    });

    // send command to client
    const { Labels } = await this.rekoClient.send(detectLabelsCommand);

    return Labels.map(({ Confidence, Name }) => ({ Name, Confidence }));
  }

  async translateText(text) {
    const translateCommand = new TranslateTextCommand({
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'pt',
      Text: text
    });

    const { TranslatedText } = await this.translateClient.send(translateCommand);
  
    return TranslatedText;
  }

  async getImageBuffer(imageUrl) {
    const { data } = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });

    const buffer = Buffer.from(data, 'base64');
    return buffer;
  }

  async main(event){
    try {
      const { queryStringParameters: { url = ''} } = event;
      const imgBuffer = await this.getImageBuffer(url);
      const labels = await this.detectImageLabels(imgBuffer);

      const text = labels.reduce((acc, elem, currentIndex) => {
        acc += `${elem.Name} with ${elem.Confidence.toFixed(2)}% of confidence`;

        if(currentIndex < labels.length - 1){
          acc += ' and '
        } else {
          acc += '.'
        }

        return acc;
      }, '');

      const translatedText = await this.translateText(text);

      return {
        statusCode: 200,
        body: JSON.stringify(translatedText)
      };
    } catch (error) {
      console.log(`ERROR: ${error.stack}`);
      return {
        statusCode: 500,
        body: 'Internal Server Error'
      }
    }
  }
}

const rekoClient = new RekognitionClient();
const translateClient = new TranslateClient();
const handler = new Handler({
  rekoClient,
  translateClient
});

module.exports.main = handler.main.bind(handler);