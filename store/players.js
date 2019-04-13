import Players from '../services/api/player'

export const state = () => {
  return {
    player: null,
    classes: [],
    awards: [],
    notes: []
  }
}

export const actions = {
  fetchPlayer(context, player) {
    player = Object.assign({}, player)
    Players.getPlayer(player).then(resp => {
      player = Object.assign(player, resp.data.Player)
      Players.getNotes(player).then(resp => {
        player.Notes = resp.data.Result
        Players.getAwards(player).then(resp => {
          player.awards = resp.data.Awards
          Players.getClasses(player).then(resp => {
            player.classes = resp.data.Classes
            context.commit('SET_PLAYER', player)
          })
        })
      })
    })
  }
}

export const mutations = {
  SET_PLAYER(state, player) {
    state.player = player
  }
}
