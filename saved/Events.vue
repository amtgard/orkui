<template>
	<div>
    <div v-for="event in events" class="eventBox">
      <h2>{{ event.name }}</h2>
      <p>{{event.days}} day event, starting {{ event.date }}</p>
      <p>{{ event.location }}</p>
      <p>{{ event.description }}</p>
      <nuxt-link :to="{ name: 'event', params: { eventId: event._id }}">
        View More
      </nuxt-link>
      <nuxt-link :to="{ name: 'register', params: { eventId: event._id }}">
        Register
      </nuxt-link>
    </div>
  </div>
</template>
<script>

import { EventsTable } from '/collections/EventsTable'
import { LocationsTable } from '/collections/LocationsTable'
export default {
  data () {
    return {
      events: []
    }
  },
  meteor: {
    events () {
      return EventsTable.find()
    }
  }
}
</script>
