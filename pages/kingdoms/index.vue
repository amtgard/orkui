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
import Kingdom from '~/components/search/Kingdom'
export default {
  computed: {
    kingdoms() {
      return this.$store.state.kingdoms.kingdoms
    }
  },
  mounted() {
    this.$store.dispatch('kingdoms/getKingdoms')
  },
  components: {
    Kingdom
  }
}
</script>
