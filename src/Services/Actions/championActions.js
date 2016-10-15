'use strict'

import rp from 'request-promise';
import lodash from 'lodash';
import * as api_data from '../../api_data';

var championActions = {

  // Fetches matchup stats
  fetchMatchup(entities, resolve){
    const champion = this.getChampionFromEntities(entities,0);
    const rank = entities.rank ? entities.rank[0].value : 'best';

    if(!this.championDoesExist(champion)) return this.resolveError("Sorry I did not understand which champion was requested", resolve);

    // Query champion.gg for best build
    return rp({
      ...this.getRequest,
      uri: this.makeUri(this.endpoints.matchup.best, champion)
    })
    .then(function(json){

      var context = {
        success: true,
        data: json
      };

      // Humanize the data
      context.text = ``;
      for (var record of json){
        var sorted = lodash.chain(record.matchups)
                       .filter((m)=>{ return m.games > 100 })
                       .sortBy((m)=>{ return m.statScore})
                       .value();

        // Sort by rank
        switch(rank){
          case 'best':
            sorted = lodash.reverse(sorted);
            break;
          default:
          break;
        }

        var matchups = lodash.chain(sorted)
                             .take(3)
                             .map((m) => { return m.key })
                             .value();

        context.text += `${matchups} are the ${rank} matchups for ${record.role} ${champion}  \n\n`;
      }

      return resolve(context);
    });
  },

  fetchSingleMatchup(entities, resolve){
    if(entities.champion.length < 2) return resolve({
      success: false,
      text: "I can't tell you about detailed matchups unless if you specify 2 champions"
    });

    const champion = this.getChampionFromEntities(entities,0);
    const enemy = this.getChampionFromEntities(entities,1);

    if(!this.championDoesExist(champion)) return this.resolveError("Sorry I did not understand which champion was requested", resolve);
    if(!this.championDoesExist(enemy)) return this.resolveError("Sorry I did not understand which enemy champion was requested", resolve);

    // Query champion.gg for best build
    return rp({
      ...this.getRequest,
      uri: this.makeUri(this.endpoints.singleMatchup.best, champion)
    })
    .then(function(json){

      var context = {
        success: true,
        data: json
      };

      // Humanize the data
      context.text = ``;
      for (var record of json){
        context.text += `${record.role} ${champion} vs ${enemy} has a ${record.winRate}% win rate  \n\n`;
      }

      return resolve(context);
    });
  },

  fetchGeneral(entities, resolve){

    const champion = this.getChampionFromEntities(entities,0);
    const intent = entities.intent[0].value;

    if(!this.championDoesExist(champion)) return this.resolveError("Sorry I did not understand which champion was requested", resolve);

    // Query champion.gg for best build
    return rp({
      ...this.getRequest,
      uri: this.makeUri(this.endpoints.general.best, champion)
    })
    .then(function(json){

      var context = {
        success: true,
        data: json
      };

      // Humanize the data
      context.text = ``;
      
      for (var record of json){
        context.text += `${record.role} ${champion}'s ${intent} is ${record.intent.val} \n\n`;
      }

      return resolve(context);
    });
  }

}


export default championActions;
