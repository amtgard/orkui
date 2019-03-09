<template>
  <div v-if="park">
    <div class="title text-left">
      <router-link
        :to="{ name: 'Parks', params: { kingdomId: park.KingdomId } }"
      >
        <span class="h2">
          {{ kingdom.KingdomName }}
        </span>
      </router-link>
      <span class="glyphicon glyphicon-arrow-right" />
      <span class="h1">
        {{ park.ParkName }}
      </span>
    </div>
    <div class="col-md-3 col-lg-2 list-group userList">
      <router-link
        :to="{ name: 'Park', params: { parkId: park.ParkId, view: 'info' } }"
        class="list-group-item"
      >
        View Park
      </router-link>
      <router-link
        :to="{ name: 'Park', params: { parkId: park.ParkId, view: 'addUser' } }"
        class="list-group-item"
      >
        Create Player
      </router-link>
      <router-link
        :to="{ name: 'Park', params: { parkId: park.ParkId, view: 'search' } }"
        class="list-group-item"
      >
        Search Players
      </router-link>
      <router-link
        :to="{
          name: 'Park',
          params: { parkId: park.ParkId, view: 'attendance' }
        }"
        class="list-group-item"
      >
        Attendance
      </router-link>
      <router-link
        :to="{
          name: 'Park',
          params: { parkId: park.ParkId, view: 'activity' }
        }"
        class="list-group-item"
      >
        Activity Report
      </router-link>
      <div class="list-group-item">
        <button
          class="btn btn-default btn-xs"
          title="Load Players"
          @click="loadPLayers"
        >
          <span class="glyphicon glyphicon-retweet" />
        </button>
        <div class="pull-right">
          <button
            v-if="activePlayers.length > 0"
            class="btn btn-default btn-xs"
            title="Toggle Players"
            @click="togglePlayers"
          >
            <span
              class="glyphicon"
              :class="
                showPlayers ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down'
              "
            />
          </button>
        </div>
        <span @click="togglePlayers">
          Active Players
        </span>
      </div>
      <div v-if="showPlayers" id="park-players-active">
        <div
          v-for="player in activePlayers"
          class="list-group-item"
          @click="setPlayer(player)"
        >
          <span class="h5">
            {{ player.Persona }}
          </span>
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
    <div class="col-md-9 col-lg-10">
      <div v-if="view == 'info'">
        <playerSearch :park="park.ParkId" />
        <div class="col-md-7 panel panel-default panel-body text-left">
          <div v-if="park.HasHeraldry" class="col-sm-2 pull-left">
            <img :src="heraldryUrl" class="img-responsive img-rounded" />
          </div>
          <p v-html="park.Description" />
          <p v-html="park.Directions" />
          <p v-if="park.Url">
            <a :href="park.Url" target="_blank">
              Website
            </a>
          </p>
          <p v-if="park.MapUrl">
            <a :href="park.MapUrl" target="_blank">
              Google Map
            </a>
          </p>
          <table class="table table-striped">
            <tbody>
              <tr v-for="officer in officers">
                <th>{{ officer.OfficerRole }}</th>
                <td>{{ officer.Persona }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ActivityReport
        v-if="view == 'activity'"
        class="col-sm-12"
        :players="players"
        :park="park"
      />
      <playerSearch v-if="view == 'search'" :park="park.ParkId" />
      <Attendance v-if="view == 'attendance'" :park="park" />
      <Player v-if="view == 'player'" :player="player" />
      <UserForm v-if="view == 'addUser'" :park="park" />
    </div>
  </div>
  <div v-else>
    no park
  </div>
</template>
<script>
import Parks from '~/services/api/park'
import Player from '~/components/Player'
import Attendance from '~/components/Attendance'
import UserForm from '~/components/UserForm'
import PlayerSearch from '~/components/SearchPlayers'
import ActivityReport from './ActivityReport'
import { mapGetters } from 'vuex'
import Collection from 'lodash/collection'

export default {
  components: {
    playerSearch: PlayerSearch,
    Player: Player,
    Attendance: Attendance,
    UserForm: UserForm,
    ActivityReport
  },
  data() {
    return {
      players: [],
      player: null,
      park: {},
      parkShort: {},
      showAttendance: false,
      addUser: false,
      start: true,
      officers: [],
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
    parkProp() {
      return {
        Name: this.park.ParkName,
        ParkId: this.park.ParkId,
        KingdomId: this.park.KingdomId
      }
    },
    ...mapGetters({
      user: 'getUser',
      authorizations: 'getAuthorizations',
      token: 'getToken'
    }),
    parkParam() {
      return this.$route.params.parkId
    },
    activePlayers() {
      return Collection.filter(this.players, { Active: 1 })
    },
    kingdom() {
      let kingdom = Collection.find(this.$store.getters.getKingdoms, {
        KingdomId: this.park.KingdomId
      })
      console.log('kingdom', this.park.KingdomId, kingdom)
      return kingdom ? kingdom : {}
    }
  },
  watch: {
    $route() {
      this.loadPark(this.$route.params.parkId)
    }
  },
  mounted() {
    this.$subscribe('players', { ParkId: this.$route.params.parkId }, () => {
      this.fetchPlayers()
    })
    this.loadPark(this.$route.params.parkId)
  },
  created() {
    this.$store.dispatch('getKingdoms')
    this.loadPark(this.$route.params.parkId)
  },
  methods: {
    fetchPlayers() {
      this.players = PlayersTable.find({ ParkId: this.park.ParkId }).fetch({
        ParkId: this.park.ParkId
      })
    },
    loadPark(parkId) {
      Parks.getParkShort(parkId).then(resp => {
        resp.data.ParkInfo.Location = JSON.parse(resp.data.ParkInfo.Location)
        this.park = resp.data.ParkInfo ? resp.data.ParkInfo : {}
        Parks.getPark(this.park.ParkId).then(resp => {
          if (resp.data.Status.Error === 'Success') {
            resp.data.mapUrl =
              'https://www.google.com/maps/embed/v1/place?key=' +
              this.mapKey +
              '&q=' +
              this.park.Address
            resp.data.GoogleGeocode = JSON.parse(resp.data.GoogleGeocode)
            resp.data.Location = JSON.parse(resp.data.Location)
            this.parkShort = Object.assign(this.park)
            let park = Object.assign(this.park, resp.data)
            this.park = park
            this.getOfficers()
            this.fetchPlayers()
          }
        })
      })
      this.view = this.$route.params.view ? this.$route.params.view : 'info'
    },
    loadPLayers() {
      Meteor.call('loadPlayers', this.park, this.token, (error, result) => {
        this.fetchPlayers()
      })
    },
    setPlayer(player) {
      this.player = player
      this.setView('player')
    },
    setView(view) {
      this.view = view
    },
    getOfficers() {
      Parks.getOfficers(this.park).then(resp => {
        if (!resp.data.Officers) {
          return
        }
        this.officers = resp.data.Officers
      })
    },
    togglePlayers() {
      this.showPlayers = !this.showPlayers
    }
  }
}
</script>
<style>
.userList {
  max-height: 80vh;
  overflow: auto;
}
</style>
