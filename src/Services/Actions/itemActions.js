'use strict'

import config from '../../config.js';
import rp from 'request-promise';
import lodash from 'lodash';
import * as api_data from '../../api_data';

var itemActions = {

  // Fetches best and popular builds
  fetchBuild(entities, resolve){
    const champion = this.getChampionFromEntities(entities,0);
    const popularity = entities.popularity ? entities.popularity[0].value : 'best';

    if(!this.championDoesExist(champion)) return this.resolveError("Sorry I did not understand which champion was requested", resolve);

    // Query champion.gg for best build
    var fetchUri;

    switch(popularity){
      case 'best':
      fetchUri = this.makeUri(this.endpoints.items.best, champion);
      break;
      default:
      fetchUri = this.makeUri(this.endpoints.items.popular, champion);
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
        context.text += `Build for ${champion} in ${record.role} are ${itemList} \n`;
      }

      return resolve(context);
    });
  },

  // Starting item sets
  fetchStartingItems(entities, resolve){
    const champion = this.getChampionFromEntities(entities,0);
    const popularity = entities.popularity ? entities.popularity[0].value : 'best';

    if(!this.championDoesExist(champion)) return this.resolveError("Sorry I did not understand which champion was requested", resolve);

    // Query champion.gg for best build
    var fetchUri;

    switch(popularity){
      case 'best':
      fetchUri = this.makeUri(this.endpoints.startingItems.best, champion);
      break;
      default:
      fetchUri = this.makeUri(this.endpoints.startingItems.popular, champion);
      break;
    }

    // Query champion.gg
    return rp({
      ...this.getRequest,
      uri: fetchUri
    })
    .then(function(json){

      var context = {
        success: true,
        data: json
      };

      context.text = ``;
      for (var record of json){
        var itemList = lodash.map(record.items, (id) => { return api_data.items[id].name; });
        context.text += `${popularity} starting items for ${champion} in ${record.role} are ${itemList} \n`;
      }

      return resolve(context);
    });
  }
}


export default itemActions;
