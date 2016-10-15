'use strict'

import rp from 'request-promise';
import lodash from 'lodash';
import * as api_data from '../../api_data';

var statsActions = {

  // Fetches
  fetchMostBanned(entities, resolve){
    return rp({
      ...this.getRequest,
      uri: this.makeUri(this.endpoints.mostBanned.best, null)+this.endpoints.mostBanned.params
    })
    .then(function(json){

      var context = {
        success: true,
        data: json
      };

      // Humanize the data
      context.text = `Most banned champions are : \n\n`;
      for (var record of json){
        context.text += `${record.role} ${record.name} - Ban Rate: ${record.general.banRate}% | Win Rate: ${record.general.winPercent}% \n\n`;
      }

      return resolve(context);
    });
  },

  // Fetches
  fetchWinRate(entities, resolve){
    const intent = entities.intent[0].value;

    return rp({
      ...this.getRequest,
      uri: this.makeUri(this.endpoints[intent].best, null)+this.endpoints[intent].params
    })
    .then(function(json){

      var context = {
        success: true,
        data: json
      };

      // Humanize the data
      context.text = `Champions with ${intent} are : \n\n`;
      for (var record of json){
        context.text += `${record.role} ${record.name} - Win Rate: ${record.general.winPercent}% \n\n`;
      }

      return resolve(context);
    });
  },

  // Fetches
  fetchRoleWinRate(entities, resolve){
    const intent = entities.intent[0].value;
    const role = entities.role[0].value;

    var fetchUri = this.makeUri(this.endpoints.winRateByRole.best, null)+this.endpoints.winRateByRole.params;

    return rp({
      ...this.getRequest,
      uri: fetchUri.replace("%ROLE%", role)
    })
    .then(function(json){

      var context = {
        success: true,
        data: json
      };

      // Humanize the data
      context.text = `${role} champions with ${intent} are : \n\n`;
      for (var record of json){
        context.text += `${record.role} ${record.name} - Win Rate: ${record.general.winPercent}% \n\n`;
      }

      return resolve(context);
    });
  }


}

export default statsActions;
