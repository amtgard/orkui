<template lang="html">
    <div v-if="event"  class="registrationContainer">
      <div class="form-container">
        <form @submit.prevent="onSubmit">
          <div class="heading">
            <p class="primary">{{ event.name }}</p>
            <p class="secondary">{{ event.date }} {{ (location) ? 'at ' + location.name : '' }}</p>
            <p class="text-muted">{{ event.description }}</p>
          </div>
          <div class="column-container">
            <div class="column">
                <div class="form-group">
                    <label for="first_name">First Name</label>
                    <input type="text" v-model="registration.first_name" required class="form-control">
                </div>
                <div class="form-group">
                    <label for="last_name">Last Name</label>
                    <input type="text" v-model="registration.last_name" required class="form-control">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" v-model="registration.email" required class="form-control">
                </div>
                <div class="form-group">
                    <label for="phone">Cell Phone</label>
                    <input type="tel" v-model="registration.phone" class="form-control">
                    <div class="help-block">
                        Best number to reach you at the event
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="form-group row">
                  <label for="ref">PayPal Reference Number</label>
                  <input type="text" v-model="registration.ref" class="form-control"  required>
                  <div class="help-block">
                        The reference number from your PayPal donation.<br/>
                        If registering more than one person with one payment, please submit this form for each person using the same PayPal reference number.
                        <p class="small">
                          <form action="https://www.paypal.com/cgi-bin/webscr" target="_blank" method="post" class="pull-right">
                            <input type="hidden" name="business" value="paypal@goldenvale.org">
                            <input type="hidden" name="cmd" value="_donations">
                            <input type="hidden" name="item_name" :value="event.name">
                            <input type="hidden" name="currency_code" value="USD">
                            <input type="image" name="submit" border="0" src="https://www.paypal.com/en_US/i/btn/btn_donateCC_LG.gif" alt="PayPal - The safer, easier way to pay online">
                            <img alt="" border="0" width="1" height="1" src="https://www.paypal.com/en_US/i/scr/pixel.gif">
                          </form>
                          <span class="h4">Cost:</span>
                          <p>{{ event.cost }}</p>
                        </p>
                    </div>
                </div>
                <div v-if="cabins.length > 0" class="form-group row">
                  <label for="cabin">Cabin</label>
                  <select class="form-control" v-model="registration.cabin"  required>
                    <option v-for="c in cabins" :value="c._id">{{ c.name }}</option>
                  </select>
                  <div class="help_block text-danger">{{ cabin_block }}</div>
                </div>
                <div class="form-group row">
                  <label>Additional Info</label>
                  <textarea class="form-control" v-model="registration.details"></textarea>
                  <div class="help-block">Please list and special needs and additional information here

                  </div>
                </div>
            </div>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary">Register</button>
            <button type="reset" v-on:click="onClear" class="btn btn-warning">Reset</button>
          </div>
        </form>
      </div>
      <div class="registrations">
        <div class="panel" v-for="reg in regByCabin">
          <div class="panel-heading">
            <span class="panel-title h3">{{ reg.cabin.name }}</span>
            <span class="small">{{reg.cabin.bunks}} bunks</span>
          </div>
          <div class="panel-body list-group">
            <div class="list-group-item" v-for="r in reg.registrations">
              {{ r.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
	<div v-else>
		Please select an event <p class="text-muted">{{ $route.params.eventId }}</p>
    {{ (event) ? event.name : '' }}
    <button class="btn btn-primary" @click="fetchEvent">wtf</button>
	</div>
</template>

<script>
import {EventsTable} from '/collections/EventsTable'
import {LocationsTable} from '/collections/LocationsTable'
import {CabinsTable} from '/collections/CabinsTable'
import {RegistrationsTable} from '/collections/RegistrationsTable'
import Moment from 'moment'
import collection from 'lodash/collection'
export default {
  data () {
    return {
      registration: {},
      location: null,
      fn_block: null,
      ln_block: null,
      email_block: null,
      ref_block: null,
      cabin_block: null,
      registrations: [],
      event: null
    }
  },
  computed: {
    cabins() {
      let event = this.event
      let cabs = []
      if (event) {
        let cabins = CabinsTable.find({location: event.location})
        cabins.forEach(function(c) {
                let regs = RegistrationsTable.find({cabin: c._id, event:event._id})
                if (c.bunks > regs.count()) {
                    cabs.push(c)
                }
			  })
				cabs = collection.sortBy(cabs, (o) => {
					return o.name
				})
			}
      return cabs
    },
    allCabins() {
        let event = this.event
        let cabins = []
        CabinsTable.find({location: event.location}).forEach( function (c) {
            cabins.push(c)
        })
        return cabins
    },
    regByCabin() {
        let regs = {}
        for (c in this.allCabins) {
            regs[this.allCabins[c]._id] = {
                cabin: this.allCabins[c],
                registrations: []
            }
        }
        this.registrations.forEach( function (r) {
            if (regs.hasOwnProperty(r.cabin)) {
                regs[r.cabin].registrations.push(r)
            }
        })
          regs = collection.sortBy(regs, (o) => {
              return o.cabin.name
          })
        return regs
    }
  },
  meteor: {
    $subscribe: {
      'locations': [],
      'events': [],
      'registrations': []
    },
    location() {
      let event = EventsTable.findOne({_id: this.$route.params.eventId})
			if (event) {
        return LocationsTable.findOne({_id: event.location})
			}
	    return null
    },
    registrations() {
      let event = EventsTable.findOne({_id: this.$route.params.eventId})
  		if (event) {
          return RegistrationsTable.find({event: event._id})
  		}
	    return null
    },
    registration () {
      let reg_id = this.$route.params.reg
      let reg = {}
      if (reg_id) {
        reg = RegistrationsTable.findOne({_id: reg_id})
      }
      return reg
    }
  },
  mounted () {
    this.$subscribe('events', () => {
      this.fetchEvent()
    })
  },
  watch: {
    '$route': 'fetchEvent'
  },
	methods: {
    fetchEvent () {
      this.event = EventsTable.findOne(this.$route.params.eventId)
    },
		onSubmit() {
      if (!this.registration._id) {
  			let player = {
  				first_name: this.registration.first_name,
  				last_name: this.registration.last_name,
  				email: this.registration.email,
  				phone: this.registration.phone
  			}
  			let player_id = Meteor.call('addPlayer', player)
        let registration = {
          player_id: player_id,
          ref: this.registration.ref,
          cabin: this.registration.cabin,
          event: (this.registration.event) ? this.registration.event : this.event._id,
          date: Moment().format('YYYY-MM-DD H:m a'),
          first_name: this.registration.first_name,
          last_name: this.registration.last_name,
          name: ((this.registration.first_name) ? this.registration.first_name : '') + ' ' +
            ((this.registration.last_name) ? this.registration.last_name : ''),
          email: this.registration.email,
          phone: this.registration.phone,
          detail: this.registration.detail
        }
        let noun = Meteor.call('addRegistration', registration, this.onClear)
        return;
      }
      Meteor.call('updateRegistration', this.registration, this.onClear)
		},
		onClear() {
			this.registration = {}
		}
	}
}
</script>

<style lang="scss">
.form-container {
  margin: 3em;
  .column-container {
    display: grid;
    grid-template-columns: 45% 45%;
    grid-column-gap: 2em;
  }
  .column {
    grid-column-start: auto;
  }
}
.heading {
  text-shadow: 2px 5px #eee;
  .primary {
    font-size: 1.5em;
    font-weight: bolder;
  }
  .secondary {
    color: #333;
    text-transform: uppercase;
  }
}
.registrations {
  display: grid;
  column-count: 4;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-rows: auto;
}
.panel-title {
  display: block;
}
.block {
  display: block;
  margin-bottom: 0;
}
.subscript {
  font-size: 0.85rem;
  font-weight: lighter;
  font-style: italic;
  margin-left: 1rem;
  line-height: 0.8rem;
  vertical-align: top;
  padding: 0;
}
.small {
  font-size: 0.85rem;
}
.cost-item {
  line-height: 1.5em;
}
</style>
