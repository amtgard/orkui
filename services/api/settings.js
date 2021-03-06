import Axios from 'axios'
import PubSub from 'pubsub-js'
import qs from 'qs'

let baseurl = process.env.ORK_URL
let token = null
export const apiurl = baseurl + 'Json/'
export const searchurl = baseurl + 'Search/SearchService.php'
export let request = function(config) {
  config.params.request.Token = token
  config = Object.assign(
    {
      url: apiurl,
      method: 'get',
      paramsSerializer: function(params) {
        return qs.stringify(params)
      }
    },
    config
  )
  let req = Axios(config)
  req.catch(error => {
    if (error.response && error.response.status === 401) {
      PubSub.publish('session.end')
      PubSub.publish('session.alert', {
        key: 'ServerError',
        type: 'danger',
        message: 'You have been logged out. Please log in again.'
      })
    } else {
      // console.log(error)
    }
  })
  return req
}
PubSub.subscribe('session.authenticated', (name, data) => {
  token = data.token
})
PubSub.subscribe('session.setToken', (name, data) => {
  console.log('setting token', data)
  token = data.token
})
