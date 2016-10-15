'use strict'

var base = {
  champion : 'http://api.champion.gg/champion'
}

var endpoints = {

  endpoints: {
    bestItems: `${base.champion}/%CHAMPION%/items/finished/mostWins`,
    popularItems: `${base.champion}/%CHAMPION%/items/finished/mostPopular`,
    matchup: `${base.champion}/%CHAMPION%/matchup`,
    bestSkillOrder: `${base.champion}/%CHAMPION%/skills/mostPopular`,
    popularSkillOrder: `${base.champion}/%CHAMPION%/skills/mostPopular`
  },

  getRequest: {
    method: 'GET',
    uri: null,
    json: true
  }

}

export default endpoints;
