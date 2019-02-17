<template>
  <div class="search">
    <div class="row">
      <div class="form-group input-group col-md-6">
        <input
          type="search"
          class="form-control"
          @keyup.enter="sendRequest"
          v-model="term"
          placeholder="Search Players, Parks, Kingdoms, Companies & Households"
        />
        <span class="input-group-btn">
          <button @click="sendRequest" class=" btn btn-primary">Search</button>
        </span>
        <span class="input-group-btn">
          <button @click="clearAll" class=" btn btn-warn">Clear</button>
        </span>
      </div>
      <div class="form-group col-md-6">
        <select class="form-control" v-model="view">
          <option value="all">All</option>
          <option value="players">Players</option>
          <option value="parks">Parks</option>
          <option value="kingdoms">Kingdoms</option>
          <option value="units">Companies/Households</option>
        </select>
      </div>
    </div>
    <div id="searchResults" class="row">
      <div
        v-if="view === 'all' || view === 'players'"
        id="playerResults"
        class="list-group"
      >
        <Player
          v-if="players.length > 0"
          class="list-group-item"
          v-for="player in players"
          :key="player.MundaneId"
          :player="player"
        />
        <span v-else>No Player Results</span>
      </div>
      <div
        v-if="view === 'all' || view === 'kingdoms'"
        id="kingdomResults"
        class="list-group"
      >
        <Kingdom
          v-if="kingdoms.length > 0"
          class="list-group-item"
          v-for="kingdom in kingdoms"
          :key="kingdom.KingdomId"
          :kingdom="kingdom"
        />
        <span v-else>No Kingdom Results</span>
      </div>
      <div
        v-if="view === 'all' || view === 'parks'"
        id="parkResults"
        class="list-group"
      >
        <Park
          v-if="parks.length > 0"
          class="list-group-item"
          v-for="park in parks"
          :key="park.ParkId"
          :park="park"
        />
        <span v-else>No Park Results</span>
      </div>
      <div
        v-if="view === 'all' || view === 'units'"
        id="unitResults"
        class="list-group"
      >
        <Unit
          v-if="units.length > 0"
          class="list-group-item"
          v-for="unit in units"
          :key="unit.UnitId"
          :unit="unit"
        />
        <span v-else>No Unit Results</span>
      </div>
    </div>
  </div>
</template>

<script>
import search from '../services/api/search'
import Player from './search/Player'
import Kingdom from './search/Kingdom'
import Park from './search/Park'
import Unit from './search/Unit'
import lo from 'lodash'
export default {
  data() {
    return {
      players: [],
      parks: [],
      kingdoms: [],
      units: [],
      term: [],
      view: 'all'
    }
  },
  components: {
    Player,
    Kingdom,
    Park,
    Unit
  },
  methods: {
    clearAll() {
      ;(this.term = ''), (this.parks = [])
      this.kingdoms = []
      this.players = []
      this.units = []
    },
    sendRequest() {
      console.log('sendign request for ' + this.term)
      search
        .players({
          park_id: this.park,
          search: this.term
        })
        .then(resp => {
          this.players = resp.data.Result
        })
      search
        .parks({
          name: this.term
        })
        .then(resp => {
          this.parks = resp.data.Result
        })
      search
        .kingdoms({
          name: this.term
        })
        .then(resp => {
          this.kingdoms = resp.data.Result
        })
      search
        .units({
          name: this.term
        })
        .then(resp => {
          this.units = resp.data.Result
        })
    }
  }
}
</script>
<style>
.heraldry {
  width: 6em !important;
  margin-top: 1em !important;
}
.heraldryBox {
  border-radius: 10px;
  background: #e8e8e8;
  height: 5em !important;
  width: 5em !important;
}
.searchRow {
  display: grid;
  grid-template-columns: 10rem auto;
  grid-column-gap: 2rem;
}
.avatarContainer {
  place-self: center;
  align-self: center;
  grid-column: 1;
}
.resultData {
  justify-items: start;
  grid-column: 2;
}
</style>
