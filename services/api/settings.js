import Axios from 'axios'
import PubSub from 'pubsub-js'
import qs from 'qs'

let config = {}
let baseurl = config.orkURL
export const apiurl = baseurl + 'Json/'
export const searchurl = baseurl + 'Search/SearchService.php'
export let request = function (config) {
  config = Object.assign({
    url: apiurl,
    method: 'get',
    paramsSerializer: function (params) {
      return qs.stringify(params)
    }
  }, config)
  req = Axios(config)
  req.catch((error) => {
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
