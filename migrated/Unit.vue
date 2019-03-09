<template>
  <div class="container">
    <h2>{{ unit.Name }}</h2>
    <div class="col-md-2">
      <img
        v-if="unit.HasHeraldry && loadAvatar"
        class="img-responsive img-rounded heraldry"
        :src="getHeraldyUrl()"
        @error="imageLoadError"
      />
      <div v-else class=" heraldryBox" />
    </div>
    <div class="col-md-10">
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
import api from '../services/api/unit'

export default {
  data() {
    return {
      unit: {},
      loadAvatar: true
    }
  },
  watch: {
    $route() {
      this.fetchUnit()
    }
  },
  created() {
    this.fetchUnit()
  },
  methods: {
    fetchUnit() {
      api.fetch(this.$route.params.unitId).then(resp => {
        this.unit = resp.data.Unit
      })
    },
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
