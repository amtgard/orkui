<template>
  <div class="container">
    <div class="two-column">
      <Park v-for="park in parks" :key="park.ParkId" :park="park"></park>
    </div>
  </div>
</template>

<script>
import PlayerSearch from '~/components/SearchPlayers'
import Parks from '~/services/api/park'
import Kingdoms from '~/services/api/kingdom'
import Kingdom from '~/components/search/Kingdom'
import Park from '~/components/search/Park'
export default {
  data() {
    return {
      parks: [],
      kingdom: {}
    }
  },
  computed: {
    kId() {
      return this.$route.params.kingdom
        ? this.$route.params.kingdom
        : this.user.KingdomId
    },
    user() {
      return this.$store.state.session.user
    }
  },
  watch: {
    kId() {
      console.log('get the kingdom')
      this.getKingdom()
    },
    kingdom() {
      this.getPark()
    }
  },
  mounted() {
    this.getKingdom().then(() => {
      this.getPark()
    })
  },
  methods: {
    getKingdom() {
      return Kingdoms.detail(this.kId).then(resp => {
        this.kingdom = resp.data
        this.$store.dispatch('kingdoms/setActive', resp.data)
      })
    },
    getPark() {
      if (!this.kingdom.KingdomInfo) return
      return Parks.getParks(this.kingdom.KingdomInfo.KingdomId).then(resp => {
        this.parks = resp.data.Parks
      })
    }
  },
  components: {
    Park,
    Kingdom,
    PlayerSearch
  }
}
</script>
