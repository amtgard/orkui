import {
  request
} from './settings'
export default {
  fetch () {
    return request({
      params: {
        call: 'Kingdom/GetKingdoms',
        request: ''
      }
    })
  },
  detail (id) {
    return request({
      params: {
        request: {
          KingdomId: id
        },
        call: 'Kingdom/GetKingdomDetails'
      }
    })
  }
}
