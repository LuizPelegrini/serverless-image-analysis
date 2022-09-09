const { RekognitionClient, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");
const { TranslateClient, TranslateTextCommand } = require('@aws-sdk/client-translate');
const Handler = require('./handler');

const rekoClient = new RekognitionClient();
const translateClient = new TranslateClient();
const handler = new Handler({
  rekoClient,
  translateClient
});

module.exports = handler.main.bind(handler);