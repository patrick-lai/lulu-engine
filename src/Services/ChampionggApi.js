'use strict'

import config from '../config.js';
import rp from 'request-promise';
import lodash from 'lodash';
import * as api_data from '../api_data';
import { endpoints, rankedData, aggregateData } from './Actions';

class ChampionggApi {

  constructor(outputPath){
    Object.assign(this,endpoints);
    Object.assign(this,rankedData);
    Object.assign(this,aggregateData);
  }

  getToken(){
    return "?api_key="+config.championGGToken;
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
    if(rank > entities.champion.length) return null;
    return this.capitalizeFirstLetter(entities.champion[rank].value);
  }

}

export default ChampionggApi;
