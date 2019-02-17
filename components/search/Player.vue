<template>
	<div class="row searchRow">
    <div class="avatarContainer">
      <img v-if="loadAvatar" class="img-responsive img-rounded heraldry" :src="getHeraldyUrl()" @error="imageLoadError" >
      <div v-else class=" heraldryBox"/>
    </div>
    <div class="resultData">
      <nuxt-link :to="{ name: 'Player', params: { playerId: player.MundaneId, parkId: player.ParkId } }">
        <p class="h3">{{ player.Persona }}</p>
      </nuxt-link>
      <span class="text-muted">
        <nuxt-link :to="{ name: 'Parks', params: { kingdomId: player.KingdomId } }">{{player.KingdomName}}</nuxt-link>
        ::
        <nuxt-link :to="{ name: 'Park', params: { parkId: player.ParkId } }">{{player.ParkName}}</nuxt-link>
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
