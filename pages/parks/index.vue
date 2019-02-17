<template>
  <div class="container">
    <span v-if="kingdom.KingdomInfo" class="h2">Parks in {{ kingdom.KingdomInfo.KingdomName }}</span>

    <PlayerSearch :kingdom="kingdom.KingdomInfo.KingdomId"></PlayerSearch>
    <div class="two-column">
      <Park v-if="parks.length > 0" v-for="park in parks" :key="park.ParkId" :park="park" />
    </div>
  </div>
</template>
<script>
import PlayerSearch from '~/components/SearchPlayers'
import Parks from '~/services/api/park'
import Kingdoms from '~/services/api/kingdom'
import Park from '~/components/search/Park'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      parks: [],
      kingdom: {}
    }
  },
  computed: {
    kId () {
      return (this.$route.params.kingdomId) ? this.$route.params.kingdomId : this.user.KingdomId
    },
    ...mapGetters({
      user: 'getUser'
    })
  },
  watch: {
    kId () {
      console.log('get the kingdom')
      this.getKingdom()
    },
    kingdom () {
      this.getPark()
    }
  },
  methods: {
    getKingdom () {
      return Kingdoms.detail(this.kId).then((resp) => {
        this.kingdom = resp.data
        this.$store.dispatch('setActive', resp.data)
      })
    },
    getPark () {
      if (!this.kingdom.KingdomInfo) return
      return Parks.getParks(this.kingdom.KingdomInfo.KingdomId).then((resp) => {
        this.parks = resp.data.Parks
      })
    }
  },
  mounted () {
    this.getKingdom().then(() => {
      this.getPark()
    })
  },
  components: {
    Park,
    PlayerSearch
  }
}
</script>
