'use strict'

import rp from 'request-promise';
import lodash from 'lodash';
import * as api_data from '../../api_data';

var runeActions = {

  // Fetches best and popular runes
  fetchRunes(entities, resolve){
    const champion = this.getChampionFromEntities(entities,0);
    const popularity = entities.popularity ? entities.popularity[0].value : 'best';

    if(!this.championDoesExist(champion)) return this.resolveError("Sorry I did not understand which champion was requested", resolve);

    // Query champion.gg for best build
    var fetchUri;

    switch(popularity){
      case 'best':
      fetchUri = this.makeUri(this.endpoints.runes.best, champion);
      break;
      default:
      fetchUri = this.makeUri(this.endpoints.runes.popular, champion);
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
        var runeList = lodash.map(record.runes, (r) => { return `\n- ${r.number}x ${r.description}`; });
        context.text += `${record.role} ${champion} ${popularity} runes are: ${runeList} \n\n`;
      }

      return resolve(context);
    });
  }

}

export default runeActions;
