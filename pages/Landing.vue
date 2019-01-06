<template lang="html">
  <div class="landing">
  	<h1>Welcome</h1>
  	<Search></Search>
  </div>
</template>

<script>
import Search from './Search'
export default {
    components: {
        Search
    }
}
</script>

<style lang="css">
.landing {
	margin: 3em;
}
</style>
