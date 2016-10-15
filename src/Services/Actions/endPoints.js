'use strict'

var base = {
  champion : 'http://api.champion.gg/champion',
  stats: 'http://api.champion.gg/stats'
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
    },
    singleMatchup: {
      best: `${base.champion}/%CHAMPION%/matchup/%ENEMY%`
    },
    general: {
      best: `${base.champion}/%CHAMPION%/general`
    },
    mostBanned: {
      best: `${base.stats}/champs/mostBanned`,
      params: `&page=1&limit=10`
    },
    "last wins": {
      best: `${base.stats}/champs/leastWinning`,
      params: `&page=1&limit=10`
    },
    "most wins": {
      best: `${base.stats}/champs/mostWinning`,
      params: `&page=1&limit=10`
    },
    winRateByRole: {
      best: `${base.stats}/role/%ROLE%`,
      params: `&page=1&limit=10`
    }
  },

  getRequest: {
    method: 'GET',
    uri: null,
    json: true
  }

}

export default endpoints;
