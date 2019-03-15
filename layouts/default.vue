<template lang="html">
  <div class="app">
    <nav class="navbar navbar-default" role="navigation">
      <div class="navbar-header">
        <nuxt-link class="navbar-brand" to="/">
          <span>Amtgard ORK</span>
        </nuxt-link>
      </div>
      <ul class="nav navbar-nav">
        <li>
          <nuxt-link to="/kingdoms">
            Kingdoms
          </nuxt-link>
        </li>
        <li v-if="activeKingdom">
          <nuxt-link
            :to="{
              name: 'Parks',
              params: { kingdomId: activeKingdom.KingdomId }
            }"
          >
            Parks
          </nuxt-link>
        </li>
      </ul>
      <Auth class="navbar-right navbar-form form-inline"></Auth>
    </nav>
    <div id="app_content">
      <Alerts />
      <nuxt />
    </div>
    <footer>
      <div class="column1">
        <a href="amtgard.com">
          Amtgard
        </a>
      </div>
      <div class="column2">
      </div>
      <div class="column3">
      </div>
    </footer>
  </div>
</template>

<script>
import Moment from 'moment'
import PubSub from 'pubsub-js'
import AuthComp from '~/components/Auth'
import Alerts from '~/components/alerts'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)
export default {
  components: {
    Alerts: Alerts,
    Auth: AuthComp
  },
  data() {
    return {
      events: []
    }
  },
  computed: {
    user() {
      return this.$store.state.session.user
    },
    activeKingdom() {
      return this.$store.state.kingdoms.activeKingdom
    },
    authenticated() {
      return this.user.MundaneId ? true : false
    }
  },
  components: {
    Auth: AuthComp,
    Alerts: Alerts
  },
  mounted() {
    this.$store.dispatch('session/load')
  }
}
</script>

<style lang="scss">
// Variables// Body
$body-bg: #f3f3f3;

// Typography
$font-family-sans-serif: 'Raleway', sans-serif;
$font-size-base: 0.9rem;
$line-height-base: 1.6;

// Bootstrap
@import 'node_modules/bootstrap/scss/bootstrap';

.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  h1,
  h2,
  h3,
  h4,
  label {
    color: #281722;
  }
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 40px auto 80px;
  grid-auto-flow: row;
  grid-row-gap: 1em;
}

#app_content {
  grid-row: 2;
  margin: 0 1em;
  min-height: 85vh;
}

main {
  text-align: center;
  margin-top: 40px;
}

nav {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495e;
  background-color: #db92c0;
  border: 0;
  a {
    color: #f5f5f5;
    padding-top: none;
  }
  .navbar-brand {
    padding-top: none;
  }
  .navbar-nav {
    display: grid;
    grid-auto-flow: column;
    padding-top: none;
    li {
      padding: 0 10px;
      a {
        color: #f5f5f5;
        font-weight: 600;
        font-size: 12pt;
      }
      a::hover {
        color: #3d2333;
      }
    }
  }
  span {
    display: block;
    position: relative;
    font-size: 24pt;
    line-height: 1;
    letter-spacing: 0.02em;
    font-weight: 400;
    box-sizing: border-box;
    padding-top: 5px;
  }
  .navitar {
    width: 35px;
  }
}
footer {
  grid-row: 3;
  align-items: stretch;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  background: #f8f8f8;
}
footer > div {
  justify-self: center;
  align-self: start;
  padding: 1em;
  img {
    height: 2em;
  }
}
footer a {
  color: #333;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.5em;
  font-size: 14px;
}
.two-column {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 1em;
}
.two-column > div {
  border: thin #f8f8f8 solid;
  margin: 0.5em;
  border-radius: 10px;
  padding: 0.5em;
}
.heraldry {
  max-height: 100px;
  max-width: 120px;
}
.image-rounded {
  border-radius: 2%;
}

.img-circle {
  border-radius: 50%;
}

@media (max-width: 1050px) {
  .navbar-header {
    float: none;
  }
  .navbar-toggle {
    display: block;
  }
  .navbar-collapse {
    border-top: 1px solid transparent;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  .navbar-collapse.collapse {
    display: none !important;
  }
  .navbar-nav {
    float: none !important;
    margin: 7.5px -15px;
    font-size: 2.25rem;
  }
  .navbar-nav > li {
    float: none;
  }
  .navbar-nav > li > a {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .navbar-text {
    float: none;
    margin: 15px 0;
  }
  /* since 3.1.0 */
  .navbar-collapse.collapse.in {
    display: block !important;
  }
  .collapsing {
    overflow: hidden !important;
  }
  body {
    font-size: 1rem;
  }
  .navitar {
    width: 50px !important;
  }
  #gv-nav-links {
    font-size: 0.75rem;
    background-color: #f8f8f8;
  }
  .two-column {
    display: grid;
    grid-template-columns: 90vw;
    justify-content: center;
  }
}
</style>
