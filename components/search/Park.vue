<template>
  <div class="row searchRow">
    <div class="avatarContainer">
      <img
        v-if="loadAvatar"
        class="img-responsive img-rounded heraldry"
        :src="getHeraldyUrl()"
        @error="imageLoadError"
      />
      <div v-else class=" heraldryBox" />
    </div>
    <div class="resultData">
      <nuxt-link :to="`/parks/${park.ParkId}`">
        <p class="h3">
          {{ park.Name }}
        </p>
      </nuxt-link>
      <p class="text-muted">
        Park
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    park: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loadAvatar: true
    }
  },
  methods: {
    imageLoadError() {
      this.loadAvatar = false
    },
    getHeraldyUrl() {
      let id = this.park.ParkId.toString()
      while (id.length < 5) {
        id = '0' + id
      }
      return 'https://amtgard.com/ork/assets/heraldry/park/' + id + '.jpg'
    }
  }
}
</script>
