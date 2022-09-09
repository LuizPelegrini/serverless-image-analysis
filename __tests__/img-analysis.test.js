const { describe, test, expect } = require('@jest/globals');

const requestMock = require('./mocks/request.json');

const { main } = require('../src');

describe('Image Analyser test suite', () => {
    test('it should analyse the image successfully and return response in portuguese', async () => {
        const expected = {
            statusCode: 200,
            body: 'Lagarto com 99,85% de confiança e Réptil com 99,85% de confiança e Crocodilo com 97,77% de confiança.'
        };

        const result = await main(requestMock);
        expect(result).toStrictEqual(expected);
    });

    test('it should return status code 400 if imageUrl query parameter is not provided', async () => {
        const expected = {
            statusCode: 400,
            body: 'An image url is required'
        };

        const result = await main({ queryStringParameters: {} });
        expect(result).toStrictEqual(expected);
    });
});