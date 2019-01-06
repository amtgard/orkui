<template>
<div class="search">
  <div class="form-group">
    <input type="search" class="form-control" @keyup="query" v-model="term" placeholder="Search Players">
  </div>
  <div class="list-group">
    <div class="list-group-item" v-for="player in players">
      <router-link :to="{ name: 'Player', params: { playerId: player.MundaneId, parkId: player.ParkId } }">
        <p class="h3">{{ player.Persona }}</p>
      </router-link>
      <span class="text-muted">
        <router-link :to="{ name: 'Parks', params: { kingdomId: player.KingdomId } }">{{player.KingdomName}}</router-link>
        ::
        <router-link :to="{ name: 'Park', params: { parkId: player.ParkId } }">{{player.ParkName}}</router-link>
      </span>
    </div>
  </div>
</div>
</template>

<script>
import search from '../services/api/search'
export default {
  props: [
    'park',
    'kingdom'
  ],
  data () {
    return {
      players: [],
      term: []
    }
  },
  methods: {
    query () {
      search.players({
        park_id: this.park,
        kingdom_id: this.kingdom,
        search: this.term
      }).then((resp) => {
        this.players = resp.data.Result
      })
    }
  }
}
</script>

<style>

</style>
