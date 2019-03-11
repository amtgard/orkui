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
          @click="loadPlayers"
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
          :key="player.PlayerId"
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
              <tr v-for="officer in officers" :key="officer.OfficerRole">
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
      return Collection.filter(
        this.$store.state.parks.officers,
        {
          ParkId: parseInt(this.park.ParkId)
        }
      )
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
      return Collection.filter(this.players, { Active: 1 })
    },
    kingdom() {
      return Collection.find(this.$store.state.kingdoms.kingdoms, {
        KingdomId: this.park.KingdomId
      }) || {}
    }
  },
  mounted() {
    this.loadPark(this.$route.params.parkId)
    if (this.$store.state.kingdoms.kingdoms.length == 0) {
      this.$store.dispatch('kingdoms/fetch')
    }
  },
  methods: {
    loadPark() {
      this.$store.dispatch('parks/fetchPark', this.park.ParkId)
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
