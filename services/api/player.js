import { request } from './settings'
// import PubSub from 'pubsub-js'
export default {
  getPlayer(player, token) {
    let id = typeof player === 'object' ? player.MundaneId : player
    return request({
      params: {
        call: 'Player/GetPlayer',
        request: {
          MundaneId: id,
          Token: token
        }
      }
    })
  },
  getNotes(player, token) {
    return request({
      params: {
        call: 'Player/GetNotes',
        request: {
          MundaneId: player.MundaneId,
          Token: token
        }
      }
    })
  },
  getAwards(player, token) {
    return request({
      params: {
        call: 'Player/AwardsForPlayer',
        request: {
          MundaneId: player.MundaneId,
          Token: token
        }
      }
    })
  },
  getClasses(player, token) {
    return request({
      params: {
        call: 'Player/GetPlayerClasses',
        request: {
          MundaneId: player.MundaneId,
          Token: token
        }
      }
    })
  },
  addUser(player, token) {
    player.Token = token
    return request({
      params: {
        call: 'Player/CreatePlayer',
        request: player
      }
    })
  }
}
