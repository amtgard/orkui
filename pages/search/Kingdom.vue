<template>
	<div class="row searchRow">
    <div class="avatarContainer">
      <img v-if="loadAvatar" class="img-responsive img-rounded heraldry" :src="getHeraldyUrl()" @error="imageLoadError" >
      <div v-else class=" heraldryBox"/>
    </div>
    <div class="resultData">
      <router-link :to="{ name: 'Parks', params: { kingdomId: kingdom.KingdomId } }">
        <p class="h3">{{ (kingdom.Name) ? kingdom.Name : kingdom.KingdomName }}</p>
      </router-link>
      <p class="text-muted">Kingdom</p>
    </div>
  </div>
</template>
<script>
export default {
  props: ['kingdom'],
  data () {
    return {
      loadAvatar: true
    }
  },
  methods: {
    imageLoadError () {
      this.loadAvatar = false
    },
    getHeraldyUrl () {
      let id = this.kingdom.KingdomId.toString()
      while (id.length < 4) {
        id = '0' + id
      }
      return 'https://amtgard.com/ork/assets/heraldry/kingdom/' + id + '.jpg'
    }
  }
}
</script>
<style>
</style>
