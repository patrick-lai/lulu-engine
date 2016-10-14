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


const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
  ['get-best-build']({entities, context}) {
    return new Promise(function(resolve, reject) {
      const champion = capitalizeFirstLetter(entities.champion[0].value);
      return championggApi.getBestBuild(champion, resolve);
    });
  },
  ['get-popular-build']({entities, context}) {
    return new Promise(function(resolve, reject) {
      const champion = capitalizeFirstLetter(entities.champion[0].value);
      return championggApi.getPopularBuild(champion, resolve);
    });
  },
};

const client = new Wit({accessToken, actions});
interactive(client);
