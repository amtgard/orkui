<template>
  <div id="volunteer" class="form">
    <div class="text-muted text-left">
      <nuxt-link :to="{ name: 'event', params: { eventId: event._id } }">
        <span class="h2">
          {{ event.name }}
        </span>
      </nuxt-link>
      <span class="glyphicon glyphicon-arrow-right"></span>
      <span class="">
        Volunteer form
      </span>
    </div>
    <form @submit="sendMessage">
      <div class="row">
        <div
          v-for="(role, key) in message.area"
          :key="key"
          class="form-group col-md-6"
        >
          <div class="checkbox">
            <label>
              <input v-model="message.area[key].on" type="checkbox" />{{
                role.label
              }}
            </label>
          </div>
          <div class="form-group">
            <label>On</label>
            <select
              v-model="message.area[key].days"
              multiple="multiple"
              class="form-control"
            >
              <option v-for="day in days[key]" :key="day" :value="day">
                {{ day }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Name</label>
        <input v-model="message.name" class="form-control" type="text" />
      </div>
      <div class="form-group">
        <label>Phone</label>
        <input v-model="message.phone" class="form-control" type="tel" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="message.email" class="form-control" type="email" />
      </div>
      <div class="form-group">
        <label>Comments</label>
        <textarea v-model="message.comments" class="form-control" />
      </div>
      <div>
        <button type="submit" class="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  props: ['event'],
  data() {
    return {
      message: {
        area: {
          npc: {
            label: 'NPC',
            on: false,
            days: []
          },
          reeve: {
            label: 'Reeve',
            on: false,
            days: []
          },
          kitchen: {
            label: 'Kitchen',
            on: false,
            days: []
          },
          security: {
            label: 'Security',
            on: false,
            days: []
          },
          clean: {
            label: 'Clean',
            on: false,
            days: []
          }
        },
        name: null,
        phone: null,
        email: null,
        comments: null
      }
    }
  },
  computed: {
    days() {
      let roles = {
        npc: [],
        reeve: [],
        kitchen: [],
        security: [],
        clean: []
      }
      let date = moment(this.event.date)
      let i = 0
      while (i < this.event.days) {
        for (let k in roles) {
          roles[k].push(date.format('dddd'))
        }
        date.add(1, 'days')
        i++
      }
      return roles
    }
  },
  methods: {
    sendMessage() {
      let body = `<h1>Volunteer form for ${this.event.name}</h1>` + `<ul>`
      let roles = this.message.area
      for (let role in roles) {
        if (!roles[role].on) {
          continue
        }
        let days = roles[role].days.join(', ')
        body += `<li>${roles[role].label}: ${days}</li>`
      }
      body += '</ul>'
      body += this.message.name ? `<div>Name: ${this.message.name}</div>` : ''
      body += this.message.phone
        ? `<div>phone: ${this.message.phone}</div>`
        : ''
      body += this.message.email
        ? `<div>email: ${this.message.email}</div>`
        : ''
      body += this.message.comments
        ? `<div>comments: ${this.message.comments}</div>`
        : ''
      for (let i in this.event.volunteerEmails) {
        Meteor.call(
          'sendEmail',
          this.event.volunteerEmails[i],
          'Goldenvale Events <goldenvale@caerbannogkeep.org>',
          'Volunteer Email',
          body
        )
      }
    }
  }
}
</script>
<style scoped="scoped">
.form {
  max-width: 680px;
  margin-right: auto;
  margin-left: auto;
}
</style>
