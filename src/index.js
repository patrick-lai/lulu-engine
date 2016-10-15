'use strict';

import Config from './config';
import { ChampionggApi } from './Services';
import lodash from 'lodash';

let Wit = null;
let interactive = null;
let championggApi = new ChampionggApi();

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
  // Popular/Common/Best type data
  ['fetch-aggregate-data']({entities, context}) {
    return new Promise(function(resolve, reject) {
      const intent = entities.intent[0].value;

      switch (intent){
        case 'build':
          return championggApi.fetchBuild(entities, resolve);
        case 'starting-build':
          return championggApi.fetchStartingBuild(entities, resolve);
        default:
          console.log(`${intent} not found`);
          break;
      }
      return resolve({
        text: "Sorry I did not understand you",
        success: false
      });
    });
  },
  // Best/Worst/First/Most/Least type data
  ['fetch-ranked-data']({entities, context}) {
    return new Promise(function(resolve, reject) {
      const intent = entities.intent[0].value;

      switch (intent){
        case 'matchup':
          return championggApi.fetchMatchup(entities, resolve);
        case 'skill':
          return championggApi.fetchSkills(entities, resolve);
        default:
          console.log(`${intent} not found`);
          break;
      }

      return resolve({
        text: "Sorry I did not understand you",
        success: false
      });

    });
  }
};

const client = new Wit({accessToken, actions});
interactive(client);
