<template>
  <div id="auth">
    <div v-if="user.UserId" class="navitar">
      <a
        href="#"
        class="dropdown-toggle"
        data-toggle="dropdown"
        role="button"
        aria-haspop-hiddenup="true"
        aria-expanded="false"
      >
        <img
          class="img-responsive img-circle navitar"
          :src="avatar"
          :alt="'Welcome ' + user.Persona"
          @error="setDefaultAvatar"
        >
      </a>
      <ul class="dropdown-menu">
        <li>
          <nuxt-link
            :to="{
              name: 'Player',
              params: { parkId: user.ParkId, playerId: user.MundaneId }
            }"
          >Me</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ name: 'Park', params: { parkId: user.ParkId } }">My Park</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ name: 'Parks', params: { kingdomId: user.KingdomId } }">My Kingdom</nuxt-link>
        </li>
        <li>
          <a href="#" @click="logout">logout</a>
        </li>
      </ul>
    </div>
    <div v-else>
      <button class="btn" @click="showPop">Login</button>
      <div :class="popClass">
        <div class="form-group">
          <label for="username" class="sr-only">Username</label>
          <input name="username" class="form-control" v-model="username" placeholder="username">
        </div>
        <div class="form-group">
          <label for="password" class="sr-only">Password</label>
          <input id="password" type="password" class="form-control" v-model="password">
        </div>
        <div class="form-group">
          <button type="button" name="Login" class="btn btn-primary btn-md" @click="login">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      username: null,
      password: null,
      useDefaultAvatar: false,
      popClass: 'pop-hidden'
    }
  },
  computed: {
    user() {
      return this.$store.state.session.user
    },
    avatar() {
      if (this.useDefaultAvatar) {
        return '/images/fodderanti.jpg'
      }
      return `https:${this.user.Image}`
    }
  },
  methods: {
    login() {
      this.$store.dispatch('session/authenticate', {
        user: this.username,
        pass: this.password
      })
    },
    logout() {
      this.$store.dispatch('logout')
      this.useDefaultAvatar = false
    },
    setDefaultAvatar() {
      this.useDefaultAvatar = true
    },
    showPop() {
      this.popClass = 'pop-display'
    }
  }
}
</script>

<style>
.navitar {
  width: 35px;
}
.pop-hidden {
  display: none;
}
.pop-display {
  position: absolute;
}
</style>
