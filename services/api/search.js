import { request } from './settings'

let config = {}
export default {
  players(params) {
    params = Object.assign(
      {
        call: 'SearchService/Player',
        limit: 300,
        search: '',
        type: 'all'
      },
      params
    )
    config.params = params
    console.log(config)
    return request(config)
  },
  kingdoms(params) {
    params = Object.assign(
      {
        call: 'SearchService/Kingdom',
        limit: 300,
        name: '',
        active: 'Active'
      },
      params
    )
    config.params = params
    return request(config)
  },
  parks(params) {
    params = Object.assign(
      {
        call: 'SearchService/Park',
        limit: 300,
        name: ''
      },
      params
    )
    config.params = params
    return request(config)
  },
  units(params) {
    params = Object.assign(
      {
        call: 'SearchService/Unit',
        limit: 300,
        name: ''
      },
      params
    )
    config.params = params
    return request(config)
  }
}
