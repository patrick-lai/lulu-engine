'use strict'

import config from '../config.js';
import rp from 'request-promise';
import lodash from 'lodash';
import * as api_data from '../api_data';

class ChampionggApi {

  constructor(outputPath){
    this.base ={
      champion : 'http://api.champion.gg/champion'
    }

    this.endpoints = {
      bestItems: `${this.base.champion}/%CHAMPION%/items/finished/mostWins`,
      popularItems: `${this.base.champion}/%CHAMPION%/items/finished/mostPopular`,
      matchup: `${this.base.champion}/%CHAMPION%/items/matchup`
    }

    this.getRequest =  {
      method: 'GET',
      uri: null,
      json: true
    }

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
    if(rank > entities.champion.lenth) return null;
    return capitalizeFirstLetter(entities.champion[rank].value);
  }

  fetchBestBuild(entities, resolve){
    const champion = getChampionFromEntities(entities,0);

    if(!this.championDoesExist(champion)) this.resolveError("Sorry I did not understand which champion was requested", resolve);

    // Query champion.gg for best build
    var fetchUri;

    switch(entities.popularity[0].value){
      case 'best':
        fetchUri = this.makeUri(this.endpoints.bestItems, champion);
        break;
      default:
        fetchUri = this.makeUri(this.endpoints.popularItems, champion);
      break;
    }

    return rp({
      ...this.getRequest,
      uri: fetchUri
    })
    .then(function(json){

      var context = {
        success: true,
        data: json
      };

      // Humanize the data
      context.text = ``;
      for (var record of json){
        var itemList = lodash.map(record.items, (id) => { return api_data.items[id].name; });
        context.text += `Build for ${champion} in ${record.role} are ${itemList}\n`;
      }

      return resolve(context);
    });
  }

  getMatchups(entities, resolve){
    if(!this.championDoesExist(champion)) this.resolveError("Sorry I did not understand which champion was requested", resolve);

    // Query champion.gg for best build
    return rp({
      ...this.getRequest,
      uri: this.makeUri(this.endpoints.popularItems, champion)
    })
    .then(function(json){

      var context = {
        success: true,
        data: json
      };

      // Humanize the data
      context.text = ``;
      for (var record of json){
        var itemList = lodash.map(record.items, (id) => { return api_data.items[id].name; });
        context.text += `Most common build for ${champion} in ${record.role} are ${itemList}\n`;
      }

      return resolve(context);
    });
  }

}

export default ChampionggApi;
