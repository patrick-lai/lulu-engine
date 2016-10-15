'use strict'

var base = {
  champion : 'http://api.champion.gg/champion'
}

var endpoints = {

  endpoints: {
    items: {
      best: `${base.champion}/%CHAMPION%/items/finished/mostWins`,
      popular: `${base.champion}/%CHAMPION%/items/finished/mostPopular`
    },
    matchup: {
      best: `${base.champion}/%CHAMPION%/matchup`
    },
    skillOrder: {
      best: `${base.champion}/%CHAMPION%/skills/mostPopular`,
      popular: `${base.champion}/%CHAMPION%/skills/mostPopular`
    },
    startingItems: {
      best: `${base.champion}/%CHAMPION%/items/starters/mostWins`,
      popular: `${base.champion}/%CHAMPION%/items/starters/mostWins`
    },
    summoners: {
      best: `${base.champion}/%CHAMPION%/summoners/mostWins`,
      popular: `${base.champion}/%CHAMPION%/summoners/mostPopular`
    },
    runes: {
      best: `${base.champion}/%CHAMPION%/runes/mostWins`,
      popular: `${base.champion}/%CHAMPION%/runes/mostPopular`
    }
  },

  getRequest: {
    method: 'GET',
    uri: null,
    json: true
  }

}

export default endpoints;
