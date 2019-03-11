import Parks from '~/services/api/park'
import Collection from 'lodash/collection'
export const state = () => {
  return {
    parks: [],
    activePark: null,
    players: [],
    officers: []
  }
}

export const actions = {
  fetchByKingdom(context, kingdom) {
    console.log(kingdom)
    let id = kingdom.KingdomId || kingdom.KingdomInfo.KingdomId
    Parks.getParks(id).then(resp => {
      context.commit('setParks', resp.data.Parks)
    })
  },
  fetchPark(context, parkId) {
    let park = {}
    Parks.getParkShort(parkId).then(resp => {
      if (resp.data.Status && resp.data.Status.Error === 'Success') {
        resp.data.ParkInfo.Location = JSON.parse(resp.data.ParkInfo.Location)
        park = Object.assign(park, resp.data.ParkInfo)
        Parks.getPark(park.ParkId).then(resp => {
          if (resp.data.Status && resp.data.Status.Error === 'Success') {
            resp.data.mapUrl = `https://www.google.com/maps/embed/v1/place?q=${
              park.Address
            }`
            resp.data.GoogleGeocode = JSON.parse(resp.data.GoogleGeocode)
            resp.data.Location = JSON.parse(resp.data.Location)
            park = Object.assign(park, resp.data)
          }
          context.commit('updatePark', park)
        })
      }
      actions.fetchOfficers(context, park)
      actions.fetchPlayers(context, park)
    })
  },
  fetchOfficers(context, park) {
    Parks.getOfficers(park).then(resp => {
      let officers = []
      if (resp.data.Officers) {
        officers = resp.data.Officers
      }
      context.commit('setOfficers', officers)
    })
  },
  fetchPlayers(context, park) {
    Parks.getPlayers(park).then(resp => {
      let players = []
      if (resp.data.Roster) {
        players = resp.data.Roster
      }
      context.commit('setPlayers', players)
    })
  }
}

export const mutations = {
  setParks(state, parks) {
    state.parks = parks
  },
  updatePark(state, park) {
    let curPark = Collection.find(state.parks, { ParkId: park.ParkId })
    if (curPark) {
      curPark = Object.assign(curPark, park)
    } else {
      state.parks.push(park)
    }
  },
  clear(state) {
    state.parks = []
    state.activePark = null
  },
  setActive(state, park) {
    state.activePark = park
  },
  setOfficers(state, list) {
    state.officers = list
  },
  setPlayers(state, list) {
    state.players = list
  }
}
