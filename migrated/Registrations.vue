<template lang="html">
  <div class="list-group" v-if="event">
    REGISTRATIONS for
    <router-link :to="{ name: 'event', params: { eventId: event._id } }">{{
      event.name
    }}</router-link>
    <div class="list-group-item" v-for="reg in registrations">
      <div class="pull-right btn-group">
        <button
          type="button"
          class="btn btn-sm btn-danger"
          v-on:click="deleteReg(reg)"
        >
          <span class="glyphicon glyphicon-trash"></span>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-warning"
          v-on:click="emailReg(reg)"
          title="resend email"
        >
          <span class="glyphicon glyphicon-retweet"></span>
        </button>
        <router-link
          class="btn btn-sm"
          :to="{
            name: 'register',
            params: { reg: reg._id, eventId: reg.event }
          }"
        >
          <span class="glyphicon glyphicon-pencil"></span>
        </router-link>
      </div>
      <p>
        <strong>Name:</strong> {{ reg.first_name }} {{ reg.last_name }},
        <strong>Email:</strong> {{ reg.email }}, <strong>Phone:</strong>
        {{ reg.phone }}
      </p>
      <p v-if="reg.cabin">
        <strong>Cabin:</strong> {{ cabins[reg.cabin].name }}
      </p>
      <p><strong>Receipt #:</strong> {{ reg.ref }}</p>
      <p>{{ reg.details }}</p>
    </div>
  </div>
  <div v-else>
    No event loaded
  </div>
</template>

<script>
import { RegistrationsTable } from '/collections/RegistrationsTable'
import { EventsTable } from '/collections/EventsTable'
import { CabinsTable } from '/collections/CabinsTable'
export default {
  data() {
    return {
      registrations: []
    }
  },
  computed: {
    event() {
      return EventsTable.findOne(this.$route.params.eventId)
    },
    cabins() {
      let cabins = {}
      CabinsTable.find().forEach(function(cab) {
        cabins[cab._id] = cab
      })
      return cabins
    }
  },
  created() {
    this.fetchRegistrations()
  },
  watch: {
    $route() {
      this.fetchRegistrations()
    }
  },
  methods: {
    deleteReg(reg) {
      Meteor.call('removeRegistration', reg)
      this.fetchRegistrations()
    },
    emailReg(reg) {
      Meteor.call('emailRegistration', reg)
      this.fetchRegistrations()
    },
    fetchRegistrations() {
      this.registrations = RegistrationsTable.find({
        event: this.$route.params.eventId
      }).fetch()
    }
  }
}
</script>

<style lang="css"></style>
