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
          class="img-fluid img-circle navitar"
          :src="avatar"
          :alt="'Welcome ' + user.Persona"
          @error="setDefaultAvatar"
          @click="showPop"
        >
      </a>
      <ul class="dropdown-menu" :class="popClass">
        <li>
          <nuxt-link :to="`/parks/${user.ParkId}/players/${user.MundaneId}`">Me</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="`/parks/${user.ParkId}`">My Park</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="'/kingdoms/' + user.KingdomId">My Kingdom</nuxt-link>
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
      this.popClass =
        this.popClass == 'pop-display' ? 'pop-hidden' : 'pop-display'
    }
  }
}
</script>

<style lang="scss">
.navitar {
  width: 35px;
}
.pop-hidden {
  display: none;
}
.pop-display {
  position: absolute;
  z-index: 9000;
  display: block !important;
}
.dropdown-menu.pop-display {
  position: relative;
  top: 100%;
  left: calc(100% - 10rem);
  z-index: 9000;
  float: left;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  a {
    color: #212529;
  }
}
</style>
