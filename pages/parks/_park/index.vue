<template>
  <div v-if="park">
    <div class="title text-left">
      <nuxt-link :to="`/kingdoms/${park.KingdomId}`">
        <span class="h2">{{ kingdom.KingdomName }}</span>
      </nuxt-link>
      <span class="glyphicon glyphicon-arrow-right">/</span>
      <span class="h2">{{ park.ParkName }}</span>
    </div>
    <div class="tow-column-nav">
      <div class="list-group userList">
        <nuxt-link
          :to="{ name: 'Park', params: { parkId: park.ParkId, view: 'info' } }"
          class="list-group-item"
        >View Park</nuxt-link>
        <nuxt-link
          :to="{ name: 'Park', params: { parkId: park.ParkId, view: 'addUser' } }"
          class="list-group-item"
        >Create Player</nuxt-link>
        <nuxt-link
          :to="{ name: 'Park', params: { parkId: park.ParkId, view: 'search' } }"
          class="list-group-item"
        >Search Players</nuxt-link>
        <nuxt-link
          :to="{
            name: 'Park',
            params: { parkId: park.ParkId, view: 'attendance' }
          }"
          class="list-group-item"
        >Attendance</nuxt-link>
        <nuxt-link
          :to="{
            name: 'Park',
            params: { parkId: park.ParkId, view: 'activity' }
          }"
          class="list-group-item"
        >Activity Report</nuxt-link>
        <div class="list-group-item">
          <button @click="loadPLayers" class="btn btn-default btn-xs" title="Load Players">
            <span class="glyphicon glyphicon-retweet"></span>
          </button>
          <div class="pull-right">
            <button
              v-if="activePlayers.length > 0"
              @click="togglePlayers"
              class="btn btn-default btn-xs"
              title="Toggle Players"
            >
              <span
                class="glyphicon"
                :class="
                  showPlayers ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down'
                "
              ></span>
            </button>
          </div>
          <span @click="togglePlayers">Active Players</span>
        </div>
        <div v-if="showPlayers" id="park-players-active">
          <div
            @click="setPlayer(player)"
            v-for="player in activePlayers"
            :key="player.PlayerId"
            class="list-group-item"
          >
            <span class="h5">{{ player.Persona }}</span>
            <ul class="text-muted">
              <li class="list-unstyled">
                <small>Dues Paid {{ player.DuesPaid ? 'True' : 'False' }}</small>
              </li>
              <li class="list-unstyled">
                <small>Park Days {{ player.ParkDaysAttended }}</small>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="">
        <div v-if="view == 'info'">
          <playerSearch :park="park.ParkId"></playerSearch>
          <div class="panel panel-default panel-body text-left">
            <div class="tow-column-nav">
              <div v-if="park.HasHeraldry">
                <img :src="heraldryUrl" class="img-fluid img-rounded">
              </div>
              <div>
                <p v-html="park.Description"></p>
                <p v-html="park.Directions"></p>
                <p v-if="park.Url">
                  <a :href="park.Url" target="_blank">Website</a>
                </p>
                <p v-if="park.MapUrl">
                  <a :href="park.MapUrl" target="_blank">Google Map</a>
                </p>
                <table class="table table-striped">
                  <tbody>
                    <tr v-for="officer in officers" :key="officer.OfficerRole">
                      <th>{{ officer.OfficerRole }}</th>
                      <td>{{ officer.Persona }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <playerSearch v-if="view == 'search'" :park="park"></playerSearch>
        <Attendance v-if="view == 'attendance'" :park="park"></Attendance>
        <Player v-if="view == 'player'" :player="player"></Player>
        <UserForm v-if="view == 'addUser'" :park="park"></UserForm>
      </div>
    </div>
  </div>
  <div v-else>no park</div>
</template>
<script>
import Parks from '~/services/api/park'
import Player from '~/components/Player'
import Attendance from '~/components/Attendance'
import UserForm from '~/components/UserForm'
import PlayerSearch from '~/components/SearchPlayers'
//import ActivityReport from './park/ActivityReport'
import { mapGetters } from 'vuex'
import Collection from 'lodash/collection'

export default {
  components: {
    playerSearch: PlayerSearch,
    Player: Player,
    Attendance: Attendance,
    UserForm: UserForm
  },
  data() {
    return {
      player: null,
      showAttendance: false,
      addUser: false,
      start: true,
      view: 'info',
      showPlayers: false
    }
  },
  computed: {
    canEdit() {
      let search = { Type: 'Park', Id: this.park.ParkId }
      let match = Collection.filter(this.authorizations, search)
      return match && match.length > 0
    },
    heraldryUrl() {
      let imageId = this.park.ParkId.toString()
      while (imageId.length < 5) {
        imageId = '0' + imageId
      }
      return `https://amtgard.com/ork/assets/heraldry/park/${imageId}.jpg`
    },
    park() {
      return Collection.find(this.$store.state.parks.parks, {
        ParkId: parseInt(this.$route.params.park)
      })
    },
    officers() {
      return Collection.filter(this.$store.state.parks.officers, {
        ParkId: parseInt(this.park.ParkId)
      })
    },
    parkProp() {
      return {
        Name: this.park.ParkName,
        ParkId: this.park.ParkId,
        KingdomId: this.park.KingdomId
      }
    },
    players() {
      return this.$store.state.parks.players
    },
    authorizations() {
      return this.$store.state.session.authorizations
    },
    parkParam() {
      return this.$route.params.parkId
    },
    activePlayers() {
      return Collection.filter(this.players, { Displayable: true })
    },
    kingdom() {
      return (
        Collection.find(this.$store.state.kingdoms.kingdoms, {
          KingdomId: this.park.KingdomId
        }) || {}
      )
    }
  },
  watch: {
    $route() {
      this.loadPark(this.$route.params.park)
    }
  },
  mounted() {
    this.loadPark(this.$route.params.park)
    if (this.$store.state.kingdoms.kingdoms.length == 0) {
      this.$store.dispatch('kingdoms/fetch')
    }
  },
  methods: {
    loadPark() {
      this.$store.dispatch('parks/fetchPark', this.$route.params.park)
    },
    togglePlayers() {
      this.showPlayers = !this.showPlayers
    },
    loadPLayers() {
      this.$store.dispatch('parks/fetchPlayers', this.park)
    }
  }
}
</script>
<style lang="scss">
// Bootstrap
@import 'node_modules/bootstrap/scss/bootstrap';

.userList {
  max-height: 80vh;
  overflow: auto;
}
.tow-column-nav {
  display: grid;
  grid-template-columns: 20% 75%;
  grid-column-gap: 5%;
}
</style>
