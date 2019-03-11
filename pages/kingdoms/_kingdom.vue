<template>
  <div class="container">
    <div class="two-column">
      <Park v-for="park in parks" :key="park.ParkId" :park="park"></Park>
    </div>
  </div>
</template>

<script>
import PlayerSearch from '~/components/SearchPlayers'
import Kingdoms from '~/services/api/kingdom'
import Kingdom from '~/components/search/Kingdom'
import Park from '~/components/search/Park'
import Collection from 'lodash/collection'
export default {
  computed: {
    kId() {
      return parseInt(this.$route.params.kingdom)
    },
    user() {
      return this.$store.state.session.user
    },
    parks() {
      return Collection.filter(this.$store.state.parks.parks, {
        Active: 'Active'
      })
    },
    kingdom() {
      let kingdom = Collection.find(this.$store.state.kingdoms.kingdoms, {
        KingdomId: this.kId
      })
      return kingdom
    }
  },
  watch: {
    kingdom() {
      this.getParks()
    }
  },
  mounted() {
    if (this.$store.state.kingdoms.kingdoms.length == 0) {
      this.$store.dispatch('kingdoms/fetch')
    }
    this.$store.dispatch('kingdoms/setActive', this.kingdom)
    this.getParks()
  },
  methods: {
    getKingdom() {},
    getParks() {
      this.$store.dispatch('parks/fetchByKingdom', this.kingdom)
    }
  },
  components: {
    Park,
    Kingdom,
    PlayerSearch
  }
}
</script>
