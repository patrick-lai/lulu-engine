'use strict'

import * as api_data from '../api_data';
import Actions from './Actions';

// Import config
if(process.env.NODE_ENV != 'production'){
  var config = require('../config').default;
}

class ChampionggApi {

  constructor(outputPath){
    // Extend this Object with actions
    Object.assign(this,Actions);
  }

  getToken(){
    const key = process.env.CHAMPION_GG_TOKEN || config.CHAMPION_GG_TOKEN;
    return "?api_key="+key;
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
