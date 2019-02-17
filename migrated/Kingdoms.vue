<template>
  <div class="container">
    <div class="two-column">
      <Kingdom
        v-for="kingdom in kingdoms"
        :key="kingdom.KingdomId"
        :kingdom="kingdom"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Kingdom from './search/Kingdom'
export default {
  computed: {
    ...mapGetters({
      kingdoms: 'getKingdoms'
    })
  },
  mounted() {
    this.$store.dispatch('getKingdoms')
  },
  components: {
    Kingdom
  }
}
</script>
<style></style>
