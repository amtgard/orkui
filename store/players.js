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
    context.commit('SET_PLAYER', player)
    Players.getPlayer(player, token).then(resp => {
      player = Object.assign(player, resp.data.Player)
      context.commit('SET_PLAYER', player)
      Players.getNotes(player, token).then(resp => {
        player.Notes = resp.data.Result
        context.commit('SET_PLAYER', player)
      })
    })
  }
}

export const mutations = {
  SET_PLAYER(state, player) {
    state.player = player
  }
}
