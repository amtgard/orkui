<template>
	<div class="row searchRow">
    <div class="avatarContainer">
      <img v-if="loadAvatar" class="img-responsive img-rounded heraldry" :src="getHeraldyUrl()" @error="imageLoadError" >
      <div v-else class=" heraldryBox"/>
    </div>
    <div class="resultData">
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
</template>
<script>
export default {
  data () {
    return {
      loadAvatar: true
    }
  },
  props: ['player'],
  methods: {
    imageLoadError () {
      this.loadAvatar = false
    },
    getHeraldyUrl () {
      let id = this.player.MundaneId.toString()
      while (id.length < 6) {
        id = '0' + id
      }
      return 'https://amtgard.com/ork/assets/players/' + id + '.jpg'
    }
  }
}
</script>
