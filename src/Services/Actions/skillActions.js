'use strict'

import rp from 'request-promise';
import lodash from 'lodash';
import * as api_data from '../../api_data';

var skillActions = {

  // Fetches best and popular skill build
  fetchSkills(entities, resolve){
    const champion = this.getChampionFromEntities(entities,0);
    const popularity = entities.popularity ? entities.popularity[0].value : 'best';

    if(!this.championDoesExist(champion)) return this.resolveError("Sorry I did not understand which champion was requested", resolve);

    // Query champion.gg for best build
    var fetchUri;

    switch(popularity){
      case 'best':
        fetchUri = this.makeUri(this.endpoints.skillOrder.best, champion);
        break;
      default:
        fetchUri = this.makeUri(this.endpoints.skillOrder.popular, champion);
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
        // Figure which one to max

        var order = [{
          skill: "Q",
          lastLeveled: lodash.findLastIndex(record.order, (s)=>{ return s == 'Q'})
        },{
          skill: "W",
          lastLeveled: lodash.findLastIndex(record.order, (s)=>{ return s == 'W'})
        },{
          skill: "E",
          lastLeveled: lodash.findLastIndex(record.order, (s)=>{ return s == 'E'})
        }]

        var sortedOrder = lodash.chain(order)
                                  .sortBy((s) => { return s.lastLeveled})
                                .map((s) => { return s.skill })
                                .value();

        context.text += `Max in order ${sortedOrder} for ${record.role} ${champion} \n\n`;
      }

      return resolve(context);
    });
  },

  // Fetches Summoners
  fetchSummoners(entities, resolve){
    const champion = this.getChampionFromEntities(entities,0);
    const popularity = entities.popularity ? entities.popularity[0].value : 'best';

    if(!this.championDoesExist(champion)) return this.resolveError("Sorry I did not understand which champion was requested", resolve);

    // Query champion.gg for best build
    var fetchUri;

    switch(popularity){
      case 'best':
        fetchUri = this.makeUri(this.endpoints.summoners.best, champion);
        break;
      default:
        fetchUri = this.makeUri(this.endpoints.summoners.popular, champion);
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
        context.text += `${record.role} ${champion} ${popularity} summoners are ${record.summoner1} and ${record.summoner2} \n\n`;
      }

      return resolve(context);
    });
  }
}


export default skillActions;
