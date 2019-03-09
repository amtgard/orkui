<template lang="html">
  <EventNew
    v-if="view == 'edit'"
    :passed-event="event"
    class="col-sm-8 col-sm-push-2"
  />
  <Volunteer v-else-if="view == 'volunteer'" :event="event"></Volunteer>
  <div v-else>
    <div class="btn-group btn-group-sm pull-right">
      <button
        v-if="canEdit"
        class="btn btn-default btn-xs"
        @click="setView('edit')"
        title="Edit"
      >
        <span class="glyphicon glyphicon-pencil"></span>
      </button>
      <router-link
        v-if="canEdit"
        :to="{ name: 'registrations', params: { eventId: event._id } }"
        class="btn btn-default btn-xs"
        title="View Registrations"
      >
        <span class="glyphicon glyphicon-book"></span>
      </router-link>
      <router-link
        :to="{
          name: 'event',
          params: { eventId: event._id, view: 'volunteer' }
        }"
        class="btn btn-default btn-xs"
        title="Volunteer"
      >
        <span class="glyphicon glyphicon-gift"></span>
      </router-link>
    </div>
    <h2>{{ event.name }}</h2>
    <div class="two-column">
      <div>
        <div class="form-group col-md-4">
          <strong>Date</strong>
          {{ prettyDate(event.date) }}
        </div>
        <div class="form-group col-md-4">
          <strong>Days</strong>
          {{ event.days }}
        </div>
        <div class="form-group col-md-4">
          <strong>Credits/Day</strong>
          {{ event.credits }}
        </div>
        <div class="form-group col-md-4">
          <strong>Fee</strong>
          ${{ event.fee }}
        </div>
        <div v-if="event.location" class="form-group col-md-8">
          <strong>Location</strong>
          {{ location.name }}
        </div>
        <div v-if="event.kingdom" class="form-group col-md-6">
          <strong>Kingdom</strong>
          {{ event.kingdom.KingdomName }}
        </div>
        <div v-if="event.park" class="form-group col-md-4">
          <strong>Park</strong>
          {{ event.park.Name }}
        </div>
        <div v-if="event.reg_by" class="form-group col-md-6">
          <strong>Register By</strong>
          {{ prettyDate(event.reg_by) }}
        </div>
      </div>
      <div>
        <div class="form-group">
          <strong>Description</strong>
          {{ event.description }}
        </div>
      </div>
    </div>
    <Signin v-if="isNowOrPast" :event="event"></Signin>
    <Register v-if="!isNowOrPast && canReg" :event="event"></Register>
  </div>
</template>

<script>
import Vue from 'vue'
import Parks from '../services/api/park'
import Events from '../services/api/event'
import { EventsTable } from '/collections/EventsTable'
import { LocationsTable } from '/collections/LocationsTable'
import { mapGetters } from 'vuex'
import Collections from 'lodash/collection'
import Signin from './Signin'
import EventNew from './EventNew'
import Register from './Register'
import Volunteer from './events/Volunteer'
import PubSub from 'pubsub-js'
import moment from 'moment'
export default {
  components: {
    Signin,
    EventNew,
    Register,
    Volunteer
  },
  data() {
    return {
      locations: [],
      kingdom: null,
      parks: [],
      activePark: null,
      view: 'view',
      templates: [],
      eventId: null,
      event: {}
    }
  },
  meteor: {
    locations() {
      return LocationsTable.find()
    }
  },
  watch: {
    'event.kingdom'() {
      this.getParks()
    },
    $route() {
      this.setEvent(this.$route.params.eventId)
      this.setView(this.$route.params.view ? this.$route.params.view : 'view')
    }
  },
  computed: {
    ...mapGetters({
      kingdoms: 'getKingdoms',
      user: 'getUser',
      token: 'getToken',
      auths: 'getAuthorizations'
    }),
    location() {
      if (!this.event.location) {
        return {}
      }
      return LocationsTable.findOne({ _id: this.event.location })
    },
    isNowOrPast() {
      var eventDate =
        this.event && this.event.date ? moment(this.event.date) : moment()
      return eventDate.isBefore(moment())
    },
    canEdit() {
      if (this.user.MundaneId == 97771) {
        return true
      } else if (this.event.park) {
        return this.hasAuth('Park', this.event.park.ParkId)
      } else if (this.event.kingdom) {
        return this.hasAuth('Kingdom', this.event.kingdom.KingdomId)
      } else if (this.event.unit) {
        return this.hasAuth('Unit', this.event.unit.UnitId)
      }
      return this.event.mundaneId == this.user.MundaneId
    },
    canReg() {
      var eventDate =
        this.event && this.event.reg_by ? moment(this.event.reg_by) : moment()
      return eventDate.isAfter(moment())
    }
  },
  created() {
    this.$subscribe('events', () => {
      this.setEvent()
      this.setView(this.$route.params.view ? this.$route.params.view : 'view')
    })
    if (this.kingdoms.length == 0) {
      this.$store.dispatch('getKingdoms')
    }
    PubSub.subscribe('events.edit.cancel', () => {
      this.view = 'view'
    })
    PubSub.subscribe('events.edit.complete', () => {
      this.setEvent()
    })
  },
  methods: {
    prettyDate(date) {
      return moment(date).format('dddd, LL')
    },
    hasAuth(type, id) {
      return Collections.find(this.auths, { Type: type, Id: id })
    },
    setEvent() {
      let eventId = this.$route.params.eventId
      if (eventId == 'add') {
        this.setView('edit')
        this.event = {}
        return
      }
      this.setView('view')
      this.eventId = eventId
      this.event = EventsTable.findOne(eventId)
    },
    setView(view) {
      console.log(view)
      this.view = view
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
    }
  }
}
</script>

<style lang="css">
  .content-container {
      margin: 2em;
      display: grid;
      grid-template-columns: auto 20em;
grid-gap: 10px;
  }
  .primary {
      grid-column-start: 1;
  }
  .side-list {
      grid-column-start: 2;
  }
</style>
