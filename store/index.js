import Vue from 'vue'
import Vuex from 'vuex'
import Session from './modules/session'
import Kingdoms from './modules/kingdoms'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    'session': Session,
    'kingdoms': Kingdoms
  }
})
