/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const main = require('./main.json');

const LaunchRequest = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechOutput = GET_FACT_MESSAGE + '. ' + HELP_MESSAGE;
    const cardInfo = 'Alexa Country Capital'
    const reprompt = 'Ask for capital of a country or say exit.';

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, cardInfo)
      .reprompt(reprompt)
      .getResponse();
  },
};

const GetCountryCapital = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
      && request.intent.name === 'GetCountryCapital');
  },
  handle(handlerInput) {
    const requestxx = handlerInput.requestEnvelope.request.intent.slots.countryName.value;

    // Get the matched json values
    var picked = data.find(o => o.name.toLowerCase() === requestxx.toLowerCase());

    const randomFact = `Country Capital is ${picked.capital}`;
    const speechOutput = GET_FACT_MESSAGE + '. The capital of ' + picked.name + ' is ' + randomFact;
    const flagURI = picked.name.replace(/\s+/g, '-').toLowerCase()

    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
      return handlerInput.responseBuilder
      .speak(speechOutput)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.0',
        document: main,
        datasources: {
          "bodyTemplate3Data": {
            "type": "object",
            "objectId": "bt3Sample",
            "backgroundImage": {
              "contentDescription": null,
              "smallSourceUrl": null,
              "largeSourceUrl": null,
              "sources": [
                {
                  "url": "https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=840",
                  "size": "small",
                  "widthPixels": 0,
                  "heightPixels": 0
                },
                {
                  "url": "https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=840",
                  "size": "large",
                  "widthPixels": 0,
                  "heightPixels": 0
                }
              ]
            },
            "title": `Country Capital Info`,
            "image": {
              "contentDescription": null,
              "smallSourceUrl": null,
              "largeSourceUrl": null,
              "sources": [
                {
                  "url": `https://cdn.countryflags.com/thumbs/${flagURI}/flag-button-square-500.png`,
                  "size": "small",
                  "widthPixels": 0,
                  "heightPixels": 0
                },
                {
                  "url": `https://cdn.countryflags.com/thumbs/${flagURI}/flag-button-square-500.png`,
                  "size": "large",
                  "widthPixels": 0,
                  "heightPixels": 0
                }
              ]
            },
            "textContent": {
              "title": {
                "type": "PlainText",
                "text": `  ${picked.name}`
              },
              "subtitle": {
                "type": "PlainText",
                "text": "Lorem Ipsum"
              },
              "primaryText": {
                "type": "PlainText",
                "text": ` Country Name: ${picked.name} <br /> Country Code (ISO 3): ${picked.iso3} <br /> Country Code (ISO 2): ${picked.iso2} <br /> Phone Code : ${picked.phone_code} <br /> Capital : ${picked.capital} <br /> Currency : ${picked.currency} <br />`
              }
            },
            "logoUrl": "http://valerianpereira.in/api/country-capitals/icons/alexa-country-108x108.png",
            "hintText": "Try, \"Alexa, give me the capital of India\""
          }
        }
      })
      .getResponse(); 
    } else {
      return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
    }
    
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .withSimpleCard(SKILL_NAME, STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .withSimpleCard(SKILL_NAME, 'Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'Country Capital';
const GET_FACT_MESSAGE = 'Welcome to Country Capital Information';
const HELP_MESSAGE = 'You can say tell me the capital of India, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const data = require('./countries');

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequest,
    GetCountryCapital,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
