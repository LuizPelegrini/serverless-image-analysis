const { RekognitionClient, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");
const { TranslateClient, TranslateTextCommand } = require('@aws-sdk/client-translate');
const Handler = require('./handler');

const rekoClient = new RekognitionClient();
const translateClient = new TranslateClient();

const detectLabelsCommand = new DetectLabelsCommand({
  MaxLabels: 3
});

const translateCommand = new TranslateTextCommand({
  SourceLanguageCode: 'en',
  TargetLanguageCode: 'pt'
});

const handler = new Handler({
  rekoClient,
  translateClient,
  detectLabelsCommand,
  translateCommand
});

module.exports = handler.main.bind(handler);