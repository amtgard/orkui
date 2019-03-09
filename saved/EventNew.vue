<template>
  <div>
    <form class="form primary" @submit.prevent="onSubmit">
      <h2>Add an event {{ event._id }}</h2>
      <div class="form">
        <div class="form-group col-md-6">
          <label for="Kingdom">
            Kingdom
          </label>
          <v-select
            :options="kingdoms"
            label="KingdomName"
            v-model="event.kingdom"
            @select="getParks"
          ></v-select>
          <div class="help-block"></div>
        </div>
        <div class="form-group col-md-6">
          <label for="Park">
            Park
          </label>
          <v-select
            :options="parks"
            v-model="event.park"
            label="Name"
          ></v-select>
        </div>
        <div class="form-group col-md-6">
          <label>Name</label>
          <input type="text" v-model="event.name" class="form-control" />
        </div>
        <div class="form-group col-md-6">
          <label>Event Template</label>
          <select v-model="event.EventId" class="form-control">
            <option></option>
            <option v-for="template in templates" :value="template.EventId">
              {{ template.Name }}
            </option>
          </select>
        </div>
        <div class="form-group" v-if="event._id">
          <label>OrkId</label>
          <input
            type="text"
            v-model="event.EventCalendarDetailId"
            class="form-control"
          />
        </div>
        <div class="form-group col-md-4">
          <label>Date</label>
          <input type="date" v-model="event.date" class="form-control" />
        </div>
        <div class="form-group col-md-4">
          <label>Last Day for Registration</label>
          <input type="date" class="form-control" v-model="event.reg_by" />
        </div>
        <div class="form-group col-md-4">
          <label>Days</label>
          <input
            type="number"
            min="1"
            max="12"
            v-model="event.days"
            class="form-control"
          />
        </div>
        <div class="form-group col-md-4">
          <label>Credits/Day</label>
          <input
            type="number"
            min="1"
            max="12"
            v-model="event.credits"
            class="form-control"
          />
        </div>
        <div class="form-group col-md-4">
          <label>Fee</label>
          <div class="input-group">
            <span class="input-group-addon">
              $
            </span>
            <input
              type="number"
              min="1"
              max="120"
              v-model="event.fee"
              class="form-control"
            />
          </div>
        </div>
        <div class="form-group col-md-8">
          <label>Location</label>
          <select v-model="event.location" class="form-control">
            <option></option>
            <option v-for="loc in locations" :value="loc._id">
              {{ loc.name }}
            </option>
          </select>
        </div>
        <div class="row">
          <div class="col-md-6 form-group">
            <label>Registration Emails</label>
            <div class="help-block">
              Emails that pre-registrations will be sent to
            </div>
            <div
              v-for="(email, i) in event.registrationEmails"
              :key="i"
              class="input-group"
            >
              <input
                type="email"
                required
                v-model="event.registrationEmails[i]"
                class="form-control"
              />
              <span class="input-group-addon">
                <button
                  v-if="i > 0"
                  type="button"
                  class="btn btn-xs input-group-btn"
                  @click.prevent="removeEmail(event.registrationEmails, i)"
                >
                  <span class="glyphicon glyphicon-minus-sign"></span>
                </button>
              </span>
            </div>
            <div>
              <button
                class="btn btn-md"
                @click.prevent="addEmail(event.registrationEmails)"
              >
                <span class="glyphicon glyphicon-plus-sign"></span>
              </button>
            </div>
          </div>
          <div class="col-md-6 form-group">
            <label>Volunteer Emails</label>
            <div class="help-block">
              Emails that volunteer remquests will be sent to
            </div>
            <div
              v-for="(email, i) in event.volunteerEmails"
              :key="i"
              class="input-group"
            >
              <input
                type="email"
                required
                v-model="event.volunteerEmails[i]"
                class="form-control"
              />
              <span class="input-group-addon">
                <button
                  v-if="i > 0"
                  type="button"
                  class="btn btn-xs input-group-btn"
                  @click.prevent="removeEmail(event.volunteerEmails, i)"
                >
                  <span class="glyphicon glyphicon-minus-sign"></span>
                </button>
              </span>
            </div>
            <div>
              <button
                class="btn btn-md"
                @click.prevent="addEmail(event.volunteerEmails)"
              >
                <span class="glyphicon glyphicon-plus-sign"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row"></div>
      <div class="row">
        <span class="h3">
          Crats
        </span>
        <span
          class="glyphicon glyphicon-plus-sign"
          @click="addCratPosition"
        ></span>
        <span>{{ event.crats.length }}</span>
        <div
          v-for="(crat, i) in event.crats"
          :key="crat.role"
          class="form-group col-md-4"
        >
          <input
            v-model="crat.role"
            type="text"
            class="form-control"
            placeholder="Crat Role"
          />
          <input type="text" placeholder="Player" v-model="crat.playerName" />
          <div v-if="crat.options.length > 0" class="list-group">
            <Player
              class="list-group-item"
              v-for="player in players"
              :key="player.MundaneId"
              :player="player"
              @click="setPlayer(crat, player, i)"
            />
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Cost</label>
        <textarea class="form-control" v-model="event.cost"></textarea>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea class="form-control" v-model="event.description"></textarea>
      </div>
      <div class="btn-group">
        <button type="submit" class="btn btn-primary">
          {{ event._id ? 'Submit' : 'Add Event' }}
        </button>
        <button
          type="button"
          v-if="event._id"
          class="btn btn-default"
          @click="cancelEdit"
        >
          Cancel
        </button>
        <button
          type="button"
          v-if="event._id"
          class="btn btn-danger"
          @click="deleteEvent(event)"
        >
          Delete
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import Vue from 'vue'
import Parks from '../services/api/park'
import Events from '../services/api/event'
import search from '../services/api/search'
import { EventsTable } from '/collections/EventsTable'
import { LocationsTable } from '/collections/LocationsTable'
import { mapGetters } from 'vuex'
import Collections from 'lodash/collection'
import PubSub from 'pubsub-js'
export default {
  props: ['passedEvent'],
  data() {
    return {
      locations: [],
      kingdom: null,
      parks: [],
      activePark: null,
      view: 'view',
      templates: [],
      event: {
        registrationEmails: [],
        volunteerEmails: [],
        crats: []
      },
      crats: []
    }
  },
  meteor: {
    $subscribe: {
      event: {}
    },
    locations() {
      return LocationsTable.find()
    }
  },
  watch: {
    'event.kingdom'() {
      this.getParks()
      this.getTemplates()
    },
    'event.park'() {
      this.getTemplates()
    },
    passedEvent(event) {
      this.setEvent(event)
    },
    $route() {
      let event = this.fetchEvent(this.$route.params.eventId)
      this.setEvent(event)
    },
    event() {
      console.log(this.event)
    }
  },
  computed: {
    ...mapGetters({
      kingdoms: 'getKingdoms',
      user: 'getUser',
      token: 'getToken'
    })
  },
  mounted() {
    if (this.kingdoms.length == 0) {
      this.$store.dispatch('getKingdoms')
    }
    this.getTemplates()
    if (this.passedEvent) {
      this.setEvent(this.passedEvent)
    }
  },
  methods: {
    fetchEvent(eventId) {
      return EventsTable.findOne(eventId)
    },
    addEmail(emailList) {
      emailList.push('')
    },
    removeEmail(emailList, key) {
      emailList.splice(key, 1)
    },
    setEvent(event) {
      this.event = Object.assign(event)
      if (!this.event.registrationEmails) {
        this.event.registrationEmails = [this.event.email]
      }
      if (!this.event.volunteerEmails) {
        this.event.volunteerEmails = []
      }
      if (!this.event.crats) {
        this.event.crats = []
      }
    },
    addCratPosition() {
      this.event.crats.push({})
      this.crats.push({})
    },
    removeCratPosition(role) {
      Collections.remove(this.event.crats, role)
    },
    searchPlayers(term, role) {
      search
        .players({
          search: this.term
        })
        .then(resp => {
          role.options = resp.data.Result
        })
    },
    setPlayer(role, player, index) {
      role.options = null
      role.playerName = player.Persona
      role.playerId = player.MundaneId
      this.event.crats[index] = role
      this.crats[index] = role
    },
    getTemplates() {
      let ops = {
        ParkId: 0,
        UnitId: 0,
        MundaneId: 0
      }
      if (this.event.kingdom) {
        ops.KingdomId = this.event.kingdom.KingdomId
      }
      if (this.event.park) {
        ops.ParkId = this.event.park.ParkId
      }
      if (ops.KingdomId) {
        Events.fetchTemplates(ops).then(resp => {
          let templates = []
          for (i in resp.data.Result) {
            let event = resp.data.Result[i]
            if (event.ParkId == ops.ParkId) {
              templates.push(event)
            }
          }
          this.templates = templates
        })
      }
    },
    onSubmit: function() {
      if (this.kingdom) {
        this.event.kingdom = this.kingdom.KingdomId
      }
      if (this.activePark) {
        this.event.park = this.activePark.ParkId
      }
      this.event.mundaneId = this.user.MundaneId
      this.event.days = parseFloat(this.event.days)
      this.event.credits = parseFloat(this.event.credits)
      let event = Meteor.call('addEvent', this.event)
      if (!this.event.EventCalendarDetailId) {
        Events.create(this.event, this.token)
      }

      if (event) {
        this.$route.push({
          name: 'Event',
          params: {
            eventId: event._id
          }
        })
        return
      }
      PubSub.publish('events.edit.complete')
    },
    deleteEvent(event) {
      Meteor.call('deleteEvent', event)
      this.event = {}
      PubSub.publish('events.edit.complete')
    },
    getParks() {
      this.parks = []
      if (!this.event.kingdom || !this.event.kingdom.KingdomId) {
        return
      }
      Parks.getParks(this.event.kingdom.KingdomId).then(resp => {
        let parks = []
        for (let i in resp.data.Parks) {
          parks.push({
            Name: resp.data.Parks[i].Name,
            ParkId: resp.data.Parks[i].ParkId,
            KingdomId: resp.data.Parks[i].KingdomId
          })
        }
        this.parks = parks
      })
    },
    cancelEdit() {
      PubSub.publish('events.edit.cancel')
    }
  }
}
</script>
