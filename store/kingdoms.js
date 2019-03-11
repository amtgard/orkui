import Kingdoms from '~/services/api/kingdom'
import PubSub from 'pubsub-js'
import Collection from 'lodash/collection'

export const state = () => {
  return {
    kingdoms: [],
    activeKingdom: null
  }
}

export const getters = {
  getKingdoms() {
    return state.kingdoms
  },
  getKingdomById(id) {
    return Collection.find(state.kingdoms, {
      KingdomId: id
    })
  },
  getKingdomByName(name) {
    return Collection.filter(state.kingdoms, function(o) {
      return o.KingdomName && o.KingdomName.indexOf(name) !== -1
    })
  },
  activeKingdom() {
    return state.activeKingdom
  }
}

export const actions = {
  getKingdoms(context) {
    return actions.fetch(context)
  },
  fetch(context) {
    let local = localStorage.getItem('kingdoms')
    if (local && local.length > 0) {
      context.commit('SET_KINGDOMS', JSON.parse(local))
      return
    }
    Kingdoms.fetch().then(resp => {
      if (resp.data.Kingdoms) {
        let kingdoms = []
        for (i in resp.data.Kingdoms) {
          kingdoms.push(resp.data.Kingdoms[i])
        }
        context.commit('SET_KINGDOMS', kingdoms)
      } else {
        PubSub.publish('alerts.add', {
          key: 'nokingdoms',
          type: 'warning',
          timestamp: Date.parse(),
          message: 'Trouble loading Kingdoms'
        })
      }
    })
  },
  setActive(context, kingdom) {
    context.commit('SET_ACTIVE', kingdom)
  }
}

export const mutations = {
  SET_KINGDOMS(state, kingdoms) {
    localStorage.setItem('kingdoms', JSON.stringify(kingdoms))
    state.kingdoms = kingdoms
  },
  SET_ACTIVE(state, kingdom) {
    state.activeKingdom = kingdom
  }
}
