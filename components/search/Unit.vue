<template>
  <div class="row searchRow">
    <div class="avatarContainer">
      <img
        v-if="unit.HasHeraldry && loadAvatar"
        class="img-responsive img-rounded heraldry"
        :src="getHeraldyUrl()"
        @error="imageLoadError"
      />
      <div v-else class=" heraldryBox" />
    </div>
    <div class="resultData">
      <nuxt-link :to="{ name: 'Unit', params: { unitId: unit.UnitId } }">
        <p class="h3">
          {{ unit.Name }}
        </p>
      </nuxt-link>
      <div class="text-muted">
        Type: {{ unit.Type }}
        <a
          :href="
            'https://amtgard.com/ork/orkui/index.php?Route=Unit/index/' +
              unit.UnitId
          "
          target="_blank"
        >
          Ork
        </a>
      </div>
      <div v-if="unit.Url" class="text-muted">
        <a :href="unit.Url" target="_blank">
          Website
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['unit'],
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
      let id = this.unit.UnitId.toString()
      while (id.length < 5) {
        id = '0' + id
      }
      return 'https://amtgard.com/ork/assets/heraldry/unit/' + id + '.jpg'
    }
  }
}
</script>
