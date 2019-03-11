import auth from '~/services/api/authentication'
import PubSub from 'pubsub-js'

export const state = () => {
  return {
    token: null,
    user: {},
    timeout: null,
    authorizations: []
  }
}

export const actions = {
  load({ commit, state }) {
    let user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      let timeout = new Date(localStorage.getItem('timeout'))
      let now = new Date()
      if (now < timeout) {
        console.log('loading user')
        commit('SET_USER', user)
        commit('SET_AUTH', JSON.parse(localStorage.getItem('authorizations')))
        commit('SET_TIMEOUT', timeout.toISOString())
        commit('SET_TOKEN', localStorage.getItem('token'))
        PubSub.publish('session.setToken', {
          token: localStorage.getItem('token')
        })
      }
    }
  },
  authenticate({ commit, state }, data) {
    auth.login(data.user, data.pass)
    PubSub.subscribe('session.authenticated', (topic, payload) => {
      console.log(payload)
      commit('SET_USER', payload.user)
      commit('SET_TOKEN', payload.token)
      commit('SET_TIMEOUT', payload.timeout)
      auth.getAuthorizations(state.user).then(resp => {
        commit('SET_AUTH', resp.data.Authorizations)
      })
    })
  },
  logout({ commit, state }) {
    commit('LOGOUT')
  }
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
    localStorage.setItem('user', JSON.stringify(user))
  },
  SET_TOKEN(state, token) {
    state.token = token
    localStorage.setItem('token', token)
  },
  SET_TIMEOUT(state, time) {
    state.timeout = time
    localStorage.setItem('timeout', time)
  },
  LOGOUT() {
    state.user = {}
    state.token = null
    state.timeout = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('timeout')
    localStorage.removeItem('authorizations')
  },
  SET_AUTH(state, auth) {
    state.authorizations = auth
    localStorage.setItem('authorizations', JSON.stringify(auth))
  }
}
