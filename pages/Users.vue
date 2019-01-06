<template lang="html">
  <div class="list-group">
	  <h2>Users</h2>
  	<div class="list-group-item" v-for="user in users">
  		<p class="h3">{{(user.username) ? user.username : user.emails[0].address}}</p>
  	</div>
  </div>
</template>

<script>
export default {
	data () {
		return {
			users: []
		}
	},
	meteor: {
		users () {
			return Meteor.users.find()
		}
	}
}
</script>

<style lang="css">
</style>
