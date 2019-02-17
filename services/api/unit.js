import { request } from './settings'
import Store from '../../store'
export default {
  fetch(unitId) {
    return request({
      method: 'get',
      params: {
        call: 'Unit/GetUnit',
        request: {
          UnitId: unitId
        }
      }
    })
  },
  addMember(unit, player) {
    return request({
      call: 'Unit/AddMember',
      request: {
        UnitId: unit.UnitId,
        MundaneId: player.MundaneId,
        Token: Store.getters.getToken
      }
    })
  }
}
