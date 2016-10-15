'use strict'

import config from '../../config.js';
import rp from 'request-promise';
import lodash from 'lodash';
import * as api_data from '../../api_data';

var aggregateData = {

  // Fetches matchup stats
  fetchMatchup(entities, resolve){
    const champion = this.getChampionFromEntities(entities,0);
    const rank = entities.rank ? entities.rank[0].value : 'best';

    if(!this.championDoesExist(champion)) this.resolveError("Sorry I did not understand which champion was requested", resolve);

    // Query champion.gg for best build
    return rp({
      ...this.getRequest,
      uri: this.makeUri(this.endpoints.matchup, champion)
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

        context.text += `${rank} matchups for ${champion} in ${record.role} are ${matchups} \n`;
      }

      return resolve(context);
    });
  },

  // Fetches best and popular skill build
  fetchSkills(entities, resolve){
    const champion = this.getChampionFromEntities(entities,0);
    const popularity = entities.popularity ? entities.popularity[0].value : 'best';

    if(!this.championDoesExist(champion)) this.resolveError("Sorry I did not understand which champion was requested", resolve);

    // Query champion.gg for best build
    var fetchUri;

    switch(popularity){
      case 'best':
        fetchUri = this.makeUri(this.endpoints.bestSkillOrder, champion);
        break;
      default:
        fetchUri = this.makeUri(this.endpoints.popularSkillOrder, champion);
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
          lastLeveled: lodash.findLastIndex(record.order, "Q")
        },{
          skill: "W",
          lastLeveled: lodash.findLastIndex(record.order, "W")
        },{
          skill: "E",
          lastLeveled: lodash.findLastIndex(record.order, "E")
        },{
          skill: "R",
          lastLeveled: lodash.findLastIndex(record.order, "R")
        }]

        var sortedOrder = lodash.chain(order)
                                .sortBy((s) => { return s.lastLeveled})
                                .map((s) => { return s.skill })
                                .value();

        context.text += `Skill Build for ${champion} in ${record.role} are ${itemList} \n`;
      }

      return resolve(context);
    });
  }

}


export default aggregateData;
