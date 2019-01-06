import {
  request
} from './settings'
import PubSub from 'pubsub-js'
export default {
  login (user, pass) {
    return request({
      params: {
        call: 'Authorization/Authorize',
        'request[UserName]': user,
        'request[Password]': pass
      }
    }).then((resp) => {
      if (resp.data.Status.Error === 'Success') {
        let token = resp.data.Token
        let user = { UserId: resp.data.UserId }
        let timeout = resp.data.Timeout

        request({
          params: {
            call: 'Player/GetPlayer',
            request: {
              'MundaneId': user.UserId
            }
          }
        }).then((resp) => {
          if (resp.data.Status.Error === 'Success') {
            user = Object.assign(resp.data.Player, user)
            PubSub.publish('session.authenticated', {
              token: token,
              user: user,
              timeout: timeout
            })
          } else {
            PubSub.publish('alerts.add', {
              type: 'warning',
              key: 'loginfailure',
              message: `Issue loging in ${resp.data.ErrorMessage} ${resp.data.Status.Error}`
            })
          }
        })
      } else {
        PubSub.publish('alerts.add', {
          key: 'loginfailure',
          type: 'warning',
          message: resp.data.Status.Error
        })
      }
    })
  },
  getAuthorizations (user) {
    return request({
      params: {
        call: 'Authorization/GetAuthorizations',
        request: {
          MundaneId: user.MundaneId
        }
      }
    })
  }
}
