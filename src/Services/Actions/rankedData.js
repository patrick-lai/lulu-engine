'use strict'

import config from '../../config.js';
import rp from 'request-promise';
import lodash from 'lodash';
import * as api_data from '../../api_data';

var rankedData = {

  // Fetches best and popular builds
  fetchBuild(entities, resolve){
    const champion = this.getChampionFromEntities(entities,0);
    const popularity = entities.popularity ? entities.popularity[0].value : 'best';

    if(!this.championDoesExist(champion)) this.resolveError("Sorry I did not understand which champion was requested", resolve);

    // Query champion.gg for best build
    var fetchUri;

    switch(popularity){
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
        context.text += `Build for ${champion} in ${record.role} are ${itemList} \n`;
      }

      return resolve(context);
    });
  }
}


export default rankedData;
