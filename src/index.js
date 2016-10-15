'use strict';

import Config from './config';
import { ChampionggApi } from './Services';
import lodash from 'lodash';

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
  if (!Config.serverToken) {
    console.log('Put in server token man');
    process.exit(1);
  }
  return Config.serverToken;
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

const client = new Wit({accessToken, actions});
interactive(client);
