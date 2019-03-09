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
      <nuxt-link
        :to="`kingdoms/${kingdom.KingdomId}`"
      >
        <p class="h3">
          {{ kingdom.Name ? kingdom.Name : kingdom.KingdomName }}
        </p>
      </nuxt-link>
      <p class="text-muted">
        Kingdom
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    kingdom: {
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
      let id = this.kingdom.KingdomId.toString()
      while (id.length < 4) {
        id = '0' + id
      }
      return 'https://amtgard.com/ork/assets/heraldry/kingdom/' + id + '.jpg'
    }
  }
}
</script>
