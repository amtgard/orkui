<template>
  <form class="form text-left" @submit="submit">
    <div class="row h2">
      <span v-if="edit">Update Player</span>
      <span v-else>Create Player</span>
    </div>
    <div class="row">
      <div class="form-group col-md-6">
        <label>First Name</label>
        <input type="text" required="required" v-model="player.GivenName" class="form-control">
      </div>
      <div class="form-group col-md-6">
        <label>Last Name</label>
        <input type="text" v-model="player.Surname" class="form-control">
      </div>
      <div class="form-group col-md-6">
        <label>Username</label>
        <input type="text" v-model="player.UserName" required="required" class="form-control">
        <div class="help-block">
          <span class="text-critical" v-if="!validations.UserName.required">Username is required</span>
          <span class="text-critical" v-if="!validations.UserName.minLength">Username must have at least {{validations.UserName.$params.minLength.min}} characters.</span>
        </div>
      </div>
      <div class="form-group col-md-6">
        <label>Password</label>
        <input type="text" v-model="player.Password" required="required" minlength="6" class="form-control">
        <div class="help-block">
        </div>
      </div>
      <div class="form-group col-md-6">
        <label>Persona Name</label>
        <input type="text" required="required" v-model="player.Persona" class="form-control">
      </div>
      <div class="form-group col-md-12">
        <label>Email</label>
        <input type="email" v-model="player.Email" class="form-control">
        <div class="help-block">
          <span class="text-critical" v-if="!validations.Email.email">email is incorectly formatted</span>
        </div>
      </div>
      <div class="col-md-6 form-group">
        <label for="Kingdom">Kingdom</label>
        <select class="form-control" v-model="player.KingdomId">
          <option v-for="kingdom in kingdoms" :value="kingdom.KingdomId">{{ kingdom.KingdomName }}</option>
        </select>
      </div>
      <div class="col-md-6 form-group">
        <label for="Park">Park</label>
        <select class="form-control" v-model="player.ParkId">
          <option v-for="park in parks" :value="park.ParkId">{{ park.Name }}</option>
        </select>
      </div>
    </div>
    <div class="form-group row">
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
  </form>
</template>

<script>
import Players from '../services/api/player'
import Parks from '../services/api/park'
import PubSub from 'pubsub-js'
import {mapGetters} from 'vuex'
const { required, minLength, email } = require('vuelidate/lib/validators')
export default {
  props: ['edit', 'park'],
  data () {
    return {
      player: {
        GivenName: null,
        Surname: null,
        OtherName: null,
        UserName: null,
        Password: null,
        Persona: null,
        Email: null,
        ParkId: null,
        KingdomId: null,
        Restricted: null,
        IsActive: 1,
        Waivered: null,
        WaiverExt: null,
        HasHeraldry: null,
        Heraldry: null,
        HasImage: null,
        Image: null
      },
      validations: {
        UserName: {
          required,
          minLength: minLength(4)
        },
        Email: {
          email
        }
      },
      parks: []
    }
  },
  computed: {
    ...mapGetters({
      token: 'getToken',
      kingdoms: 'getKingdoms'
    })
  },
  methods: {
    getParks () {
      Parks.getParks(this.player.KingdomId).then((resp) => {
        this.parks = resp.data.Parks
      })
    },
    setPark () {
      if (this.park) {
        this.player.ParkId = this.park.ParkId
        this.player.KingdomId = this.park.KingdomId
      }
    },
    submit () {
      Players.addUser(this.player, this.token).then(resp => {
        if (resp.data.Error === 'Success') {
          PubSub.publish('alerts.add', {
            key: 'useradd',
            timestamp: Date().toString(),
            message: 'User creation resturned',
            type: 'success'
          })
        } else {
          PubSub.publish('alerts.add', {
            key: 'useradd',
            timestamp: Date().toString(),
            message: `User creation error: ${resp.data.Error}`,
            type: 'warning'
          })
        }
      })
    }
  },
  watch: {
    'player.kingdomId' () {
      this.parks = []
      this.getParks()
    },
    park () {
      this.setPark()
    }
  },
  mounted () {
    if (typeof this.edit === 'object') {
      this.player = Object.assign(this.player, this.edit)
    }
    this.setPark()
    this.$store.dispatch('getKingdoms')
    this.getParks()
  }
}
</script>

<style>

</style>
