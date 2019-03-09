<template lang="html">
  <div class="app">
    <nav class="navbar navbar-default" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <button
            type="button"
            class="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#gv-nav-links"
            aria-expanded="false"
          >
            <span class="sr-only">
              Toggle navigation
            </span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <nuxt-link class="navbar-brand" to="/">
            <span>GV Events</span>
          </nuxt-link>
        </div>
        <div class="collapse navbar-collapse" id="gv-nav-links">
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
            <li v-if="authenticated">
              <nuxt-link to="/location/add">
                <span>Locations</span>
              </nuxt-link>
            </li>
            <li class="dropdown">
              <a
                href="#"
                class="dropdown-toggle"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Events <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                <nuxt-link v-if="authenticated" tag="li" to="/event/add">
                  <a>Add New</a>
                </nuxt-link>
                <nuxt-link tag="li" to="/events">
                  <a>View All</a>
                </nuxt-link>
                <li role="separator" class="divider"></li>
                <nuxt-link
                  v-for="event in events"
                  :key="event._id"
                  tag="li"
                  :to="{ name: 'event', params: { eventId: event._id } }"
                >
                  <a>{{ event.name }}</a>
                </nuxt-link>
              </ul>
            </li>
          </ul>
          <ul class="nav navbar-right nav-divider">
            <Auth class="navbar-right navbar-form">
              ??
            </Auth>
          </ul>
        </div>
      </div>
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
        <a href="https://etherealvisions.us/">
          Shawn Barratt
        </a>
      </div>
      <div class="column3">
        <a href="https://git.etherealvisions.us/mathus13/gvevents">
          <img src="/images/gitlab.svg" alt="" />
        </a>
      </div>
    </footer>
  </div>
</template>

<script>
import { EventsTable } from '/collections/EventsTable'
import Moment from 'moment'
import PubSub from 'pubsub-js'
import AuthComp from './Auth'
import Alerts from './alerts'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      events: []
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser',
      activeKingdom: 'activeKingdom'
    }),
    authenticated() {
      return this.user.MundaneId ? true : false
    }
  },
  meteor: {
    events() {
      return EventsTable.find({
        date: {
          $gte: Moment()
            .subtract(14, 'days')
            .format('YYYY-MM-DD')
        }
      })
    }
  },
  components: {
    Auth: AuthComp,
    Alerts: Alerts
  },
  mounted() {
    this.$store.dispatch('load')
  }
}
</script>

<style lang="scss">
$icon-font-path: '../../node_modules/bootstrap-sass/assets/fonts/bootstrap/';

body {
  margin: 0;
  overflow-x: hidden;
}

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

.navbar-default {
  background-color: none;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495e;
  background-color: #db92c0;
  color: #ffffff;
  span {
    display: block;
    position: relative;
    font-size: 24pt;
    line-height: 1;
    letter-spacing: 0.02em;
    font-weight: 400;
    box-sizing: border-box;
    padding-top: 16px;
  }
  nav {
    a {
      color: #fff;
    }
  }
  .navbar-default {
    background-color: inherit;
    border: 0;
    color: #f5f5f5;
    .navbar-brand {
      color: #fff;
    }
    .navbar-nav {
      li {
        a {
          color: #f5f5f5;
          color: #3d2333;
        }
      }
    }
  }
  #nav-links {
    z-index: 90000;
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
  ,
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
