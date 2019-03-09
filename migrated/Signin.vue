<template>
  <div syle="border:thick red solid; min-height:100px; min-width:100px; ">
    <div class="h3">
      Event Signin
    </div>
    <div class="panel-body">
      <div class="col-md-6 text-left">
        <form @submit.prevent="send">
          <div class="row">
            <div class="col-md-6 form-group">
              <label for="Kingdom">
                Kingdom
              </label>
              <select class="form-control" v-model="kingdom">
                <option v-for="kingdom in kingdoms" :value="kingdom">
                  {{ kingdom.KingdomName }}
                </option>
              </select>
            </div>
            <div class="col-md-6 form-group">
              <label for="Park">
                Park
              </label>
              <select class="form-control" v-model="park">
                <option v-for="park in parks" :value="park">
                  {{ park.Name }}
                </option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <label>
                <input type="checkbox" v-model="hasOrk" />Player has an
              </label>
              <div class="form-group" v-if="hasOrk">
                <label for="Player">
                  Player
                </label>
                <v-select
                  :options="players"
                  label="Persona"
                  v-model="player"
                ></v-select>
                <input
                  type="text"
                  placeholder="Mundane Name"
                  v-model="mundane"
                  class="form-control"
                />
              </div>
              <div class="form-group" v-else>
                <label for="Player">
                  Player
                </label>
                <input
                  type="text"
                  placeholder="Persona"
                  v-model="persona"
                  class="form-control"
                />
                <input
                  type="text"
                  placeholder="Mundane Name"
                  v-model="mundane"
                  class="form-control"
                />
              </div>
            </div>
            <div class="form-group col-md-6">
              <label for="Class">
                Class
              </label>
              <div v-for="index in parseFloat(event.days)" :key="index">
                <select
                  class="form-control"
                  v-model="skill[index]"
                  @change="forwardSkill(index)"
                  required
                >
                  <option v-for="skill in classes" :value="skill">
                    {{ skill.Name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-6">
              <label>Date of Birth</label>
              <input type="date" v-model="dob" class="form-control" required />
            </div>
            <div class="col-md-6">
              <div class="age-box" :class="ageClass"></div>
            </div>
          </div>
          <div class="formGroup row">
            <div class="row">
              <label>
                <input
                  type="checkbox"
                  v-model="waivered"
                  title="Has the player signed the Liability Waiver"
                />
                Waivered
              </label>
              <label>
                <input
                  type="checkbox"
                  v-model="zta"
                  title="Has the player signed the Zero Tolerance Policy"
                />
                Zero Tolerance Policy
              </label>
              <label>
                <input
                  type="checkbox"
                  v-model="paid"
                  title="Has the player paid troll"
                />
                Paid
              </label>
              <label>
                <input
                  type="checkbox"
                  v-model="minor"
                  title="Is the player under 14"
                />
                Non-Standard Fee
              </label>
            </div>
            <div v-if="minor" class="row col-md-4 form-group">
              <label class="sr-only">
                Troll Fee
              </label>
              <div class="input-group">
                <span class="input-group-addon">
                  $
                </span>
                <input
                  type="number"
                  class="form-control"
                  placeholder="Ammount paid"
                  v-model="amount"
                  :max="event.fee"
                />
              </div>
            </div>
          </div>
          <div class="form-group row">
            <button type="button" class="btn btn-default" @click="clear">
              Reset
            </button>
            <button type="submit" class="btn btn-primary">
              Enter Attendance
            </button>
          </div>
        </form>
      </div>
      <div class="col-md-5 list-group">
        <div>
          {{ event.name }}
          <button
            v-if="canEdit"
            class="btn btn-xs pull-right"
            @click="setAttendance(signins)"
          >
            Commit Attendance
          </button>
        </div>
        <div class="small text-muted">
          Total {{ signins.length }} ${{ total }}
        </div>
        <div
          v-for="item in signins"
          v-if="item"
          class="list-group-item"
          :style="!item.hasOrk ? 'border:2px red solid' : ''"
        >
          <div v-if="canEdit" class="pull-right">
            <a href="#" class="text-default" @click="edit(item)">
              <span class="glyphicon glyphicon-pencil"></span>
            </a>
            <a href="#" class="text-danger" @click="remove(item)">
              <span class="glyphicon glyphicon-remove"></span>
            </a>
          </div>
          <div class="pull-right age-box" :class="getAgeClass(item.age)"></div>
          <p>
            <router-link
              :to="{
                name: 'Player',
                params: {
                  playerId: item.mundaneId,
                  parkId: item.parkId,
                  kingdomId: item.kingdomId
                }
              }"
            >
              {{ item.persona }}
            </router-link>
          </p>
          <div class="text-muted">
            {{ item.mundaneName }}
            <span class="row">
              {{ joinClasses(item.classes) }}
            </span>
          </div>
          <span class="text-muted">
            {{ item.kingdomName }}::{{ item.parkName }}
            <span v-if="item.paid"> ${{ item.amount }} </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Parks from '../services/api/park'
import Events from '../services/api/event'
import { mapGetters } from 'vuex'
import Players from '../services/api/player'
import Collections from 'lodash/collection'
import Moment from 'moment'
import PubSub from 'pubsub-js'
import { SigninTable } from '/collections/SigninTable'
import { EventsTable } from '/collections/EventsTable'
import { PlayersTable } from '/collections/PlayersTable'
import vSelect from 'vue-select'
import Vue from 'vue'
Vue.component('v-select', vSelect)
export default {
  props: ['event'],
  data() {
    return {
      classes: [],
      parks: [],
      players: [],
      credits: 1,
      signins: {},
      kingdom: null,
      park: null,
      skill: [],
      player: null,
      waivered: false,
      paid: false,
      zta: false,
      hasOrk: true,
      minor: false,
      amount: 10,
      playerId: null,
      dob: null,
      mundane: null,
      persona: null
    }
  },
  computed: {
    ...mapGetters({
      kingdoms: 'getKingdoms',
      token: 'getToken',
      user: 'getUser',
      auths: 'getAuthorizations'
    }),
    activePark() {
      return Collections.find(this.parks, { ParkId: this.parkId })
    },
    userCanSubmit() {
      if (
        this.event.park &&
        Collections.find(auths, { Type: 'Park', Id: this.event.park.ParkId })
      ) {
        return true
      }
      if (
        this.event.kingdom &&
        Collections.find(auths, {
          Type: 'Kingdom',
          Id: this.event.kingdom.KingdomId
        })
      ) {
        return true
      }
      return false
    },
    total() {
      let total = 0
      for (let i in this.signins) {
        let row = this.signins[i]
        let amt = parseFloat(row.amount)
        if (row.paid && amt) {
          total += amt
        }
      }
      return total
    },
    age: {
      get() {
        let now = Moment()
        let birth = Moment(this.dob)
        return now.diff(birth, 'years')
      },
      set(age) {
        this.dob = Moment()
          .subtract(age, 'years')
          .format('YYYY-MM-DD')
        return this.dob
      }
    },
    ageClass() {
      return this.getAgeClass(this.age)
    },
    canEdit() {
      if (this.event.park) {
        return this.hasAuth('Park', this.event.park.ParkId)
      } else if (this.event.kingdom) {
        return this.hasAuth('Kingdom', this.event.kingdom.KingdomId)
      } else if (this.event.unit) {
        return this.hasAuth('Unit', this.event.unit.UnitId)
      }
      return this.event.mundaneId == this.user.MundaneId
    }
  },
  watch: {
    kingdom() {
      this.parks = []
      this.players = []
      this.getParks()
    },
    park() {
      this.players = []
      this.getPlayers()
    },
    hasOrk(change) {
      this.player = change ? null : {}
    },
    player(player) {
      if (player && player.Surname.length > 0) {
        this.mundane = `${player.GivenName} ${player.Surname}`
      }
    }
  },
  mounted() {
    this.$store.dispatch('getKingdoms')
    Parks.getClasses().then(resp => {
      this.classes = resp.data.Classes
    })
    this.fetchSignins()
  },
  methods: {
    forwardSkill(event) {
      let skill = this.skill[event]
      if (event > 1) {
        return
      }
      for (x = 0; x < parseFloat(this.event.days) + 1; x++) {
        this.skill[x] = skill
      }
    },
    fetchSignins() {
      this.signins = SigninTable.find({
        $or: [{ eventId: this.event._id }, { eventId: this.event.EventId }]
      }).fetch()
    },
    hasAuth(type, id) {
      return Collections.find(this.auths, { Type: type, Id: id })
    },
    setAttendance(signins) {
      for (let i in signins) {
        if (!signins[i].mundaneId) {
          continue
        }
        for (let x in signins[i].classes) {
          if (!signins[i].classes[x] || !signins[i].classes[x].ClassId) {
            continue
          }

          let date = Moment(this.event.date)
            .add(x, 'days')
            .format('YYYY-MM-DD')
          Events.addAttendance(
            this.token,
            date,
            signins[i].classes[x].ClassId,
            this.event.EventCalendarDetailId,
            this.event.EventId,
            this.event.credits,
            signins[i].mundaneId
          )
        }
      }
    },
    edit(signin) {
      this.kingdom = Collections.find(this.kingdoms, {
        KingdomId: signin.kingdomId
      })
      this.player = {
        MundaneName: signin.mundaneName,
        MundaneId: signin.mundaneId,
        Persona: signin.persona
      }
      this.hasOrk = signin.hasOrk
      this.skill = signin.classes
      this.waivered = signin.waivered
      this.zta = signin.zta
      this.paid = signin.paid
      this.minor = signin.minor
      this.amount = signin.amount
      this.age = signin.age
      this.parkId = signin.parkId
      this.park = Collections.find(this.parks, { ParkId: signin.parkId })
      if (!this.park) {
        this.park = { ParkId: signin.parkId, Name: signin.parkName }
        console.log('manually set park', this.park)
      }
    },
    send() {
      let signin = {
        time: Moment(),
        eventName: this.event.name,
        eventId: this.event.EventId,
        kingdomName: this.kingdom.KingdomName,
        kingdomId: this.kingdom.KingdomId,
        parkId: this.park.ParkId,
        parkName: this.park.Name,
        mundaneName: this.player.MundaneName,
        mundaneId: this.player.MundaneId,
        persona: this.player.Persona,
        classes: this.skill,
        hasOrk: this.hasOrk,
        waivered: this.waivered,
        zta: this.zta,
        paid: this.paid,
        minor: this.minor,
        amount: this.amount,
        age: this.age
      }
      let resp = Meteor.call('signin', signin, this.onClear)
    },
    onClear() {
      this.waivered = false
      this.paid = false
      this.zta = false
      this.hasOrk = true
      this.minor = false
      this.amount = this.event.fee
      this.player = null
      this.dob = null
      this.fetchSignins()
    },
    clear() {
      this.kingdom = null
      this.park = null
      this.skill = []
      this.player = null
      this.waivered = false
      this.paid = false
      this.zta = false
      this.hasOrk = true
      this.minor = false
    },
    remove(signin) {
      Meteor.call('removeSignin', signin)
    },
    getParks() {
      if (!this.kingdom) {
        return []
      }
      Parks.getParks(this.kingdom.KingdomId).then(resp => {
        this.parks = resp.data.Parks
      })
    },
    getPlayers() {
      if (!this.park) {
        return []
      }
      Parks.getPlayers(this.park, this.token).then(resp => {
        players = []
        for (let i in resp.data.Roster) {
          if (resp.data.Roster[i].Persona) {
            players.push(resp.data.Roster[i])
          }
        }
        this.players = players
      })
    },
    getAgeClass(age) {
      if (!parseFloat(age)) {
        return null
      }
      let base = 'age-box-'
      if (age < 14) {
        return `${base}13`
      }
      if (age < 21) {
        return `${base}20`
      }
      return `${base}21`
    },
    joinClasses(classes) {
      let list = []
      for (let i in classes) {
        if (classes[i]) {
          list.push(classes[i].Name)
        }
      }
      return list.join(', ')
    }
  }
}
</script>

<style>
.age-box {
  height: 2em;
  width: 4em;
  background-color: #333;
  margin-top: 2em;
}

.age-box-13 {
  background-color: red;
}

.age-box-20 {
  background-color: yellow;
}

.age-box-21 {
  background-color: green;
}
</style>
