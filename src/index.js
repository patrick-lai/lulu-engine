'use strict';

import { ChampionggApi } from './Services';
import lodash from 'lodash';

// Server
import express from 'express';
import Server from './Server/Server';
import FbChatBot from './Messenger/FbChatBot';
import Api from './Server/Api';

// Import config
if(process.env.NODE_ENV != 'production'){
  var config = require('./config').default;
}

let Wit = null;
let interactive = null;
let championggApi = new ChampionggApi();

let errorResolve = {
  text: "Sorry I did not understand you",
  success: false
}

try {
  // if running from repo
  Wit = require('../').Wit;
  interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

const accessToken = (() => {
  if (!config.WIT_TOKEN && !process.env.WIT_TOKEN) {
    console.log('Put in server token man');
    process.exit(1);
  }
  return process.env.WIT_TOKEN || config.WIT_TOKEN;
})();

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('user said...', request.text);
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
  // Fetch rankable data
  ['fetch-ranked-data']({entities, context}) {
    return new Promise(function(resolve, reject) {
      const intent = entities && entities.intent ? entities.intent[0].value : null;

      switch (intent){
        case 'build':
          return championggApi.fetchBuild(entities, resolve);
          break;
        case 'starting-items':
          return championggApi.fetchStartingItems(entities, resolve);
          break;
        case 'matchup':
          return championggApi.fetchMatchup(entities, resolve);
          break;
        case 'skill':
          return championggApi.fetchSkills(entities, resolve);
          break;
        case 'summoners':
            return championggApi.fetchSummoners(entities, resolve);
            break;
        case 'runes':
            return championggApi.fetchRunes(entities, resolve);
            break;
        case null:
        default:
          console.log(`${intent} not found`);
          break;
      }

      return resolve(errorResolve);

    });
  }
};

const wit = new Wit({accessToken, actions});
const app = express();
const server = new Server(app);
const fbChatBot = new FbChatBot(app,wit);
const api = new Api(app,wit);

// Start serving
fbChatBot.setUpWebhook();
api.setupApi();
server.serve();

interactive(wit);
