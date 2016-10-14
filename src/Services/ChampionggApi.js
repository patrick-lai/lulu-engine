'use strict'

import config from '../config.js';
import rp from 'request-promise';
import lodash from 'lodash';
import * as api_data from '../api_data';

class ChampionggApi {

  constructor(outputPath){
    this.endpoints = {
      allChampionData : "http://api.champion.gg/champion",
      bestItems: "http://api.champion.gg/champion/%CHAMPION%/items/finished/mostWins",
      popularItems: "http://api.champion.gg/champion/%CHAMPION%/items/finished/mostPopular"
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

  getBestBuild(champion, resolve){
    if(!this.championDoesExist(champion)) this.resolveError("Sorry I did not understand which champion was requested", resolve);

    // Query champion.gg for best build
    return rp({
      ...this.getRequest,
      uri: this.makeUri(this.endpoints.bestItems, champion)
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
        context.text += `Best build for ${champion} in ${record.role} are ${itemList}\n`;
      }

      return resolve(context);
    });
  }

  getPopularBuild(champion, resolve){
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
