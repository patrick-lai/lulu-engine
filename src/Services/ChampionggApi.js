'use strict'

import config from '../config.js';
import rp from 'request-promise';
import lodash from 'lodash';
import * as api_data from '../api_data';
import Actions from './Actions';

class ChampionggApi {

  constructor(outputPath){
    // Extend this Object with actions
    Object.assign(this,Actions);
  }

  getToken(){
    return "?api_key="+config.CHAMPION_GG_TOKEN;
  }

  makeUri(endPoint, champion){
    return endPoint.replace("%CHAMPION%", champion)+this.getToken();
  }

  championDoesExist(champion){
    return api_data.champions[champion] ? true : false;
  }

  resolveError(message, resolve){
    return resolve({
      success: false,
      error: message
    });
  }

  capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getChampionFromEntities(entities, rank){
    if(!entities || !entities.champion || rank > entities.champion.length) return null;
    return this.capitalizeFirstLetter(entities.champion[rank].value);
  }

}

export default ChampionggApi;
