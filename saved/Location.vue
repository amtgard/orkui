<template lang="html">
  <div>
    <div class="form form-content col-md-5">
      <vue-form-generator :schema="schema" :model="location">
      </vue-form-generator>
      <div v-if="location._id">
        <h3>Cabins</h3>
        <Cabin :location="location" />
      </div>
    </div>
    <div class="side-list col-md-6 col-md-push-1">
      <div class="h3">
        Locations
      </div>
      <div class="list-group">
        <div class="list-group-item" v-for="loc in locations">
          <div class="list-group-item-heading">
            {{ loc.name }}
            <a href="#" class="pull-right" @click="setLocation(loc)">
              <span class="glyphicon glyphicon-pencil"></span>
            </a>
          </div>
          <div class="list-group-item-body">
            <ul class="list-unstyled">
              <li class="text-muted small">
                <address>{{ loc.address }}</address>
              </li>
              <li v-if="loc.url">
                <a target="_blank" :href="loc.url">
                  Website
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import veuForms from 'vue-form-generator'
import { LocationsTable } from '/collections/LocationsTable'
import { CabinsTable } from '/collections/CabinsTable'
import Cabin from '/imports/ui/Cabin'
export default {
  components: {
    'vue-form-generator': veuForms.component,
    Cabin
  },
  data() {
    return {
      location: {
        address: '',
        name: '',
        url: ''
      },
      tmpCabin: {},
      locations: [],
      schema: {
        fields: [
          {
            type: 'input',
            inputType: 'text',
            label: 'Name',
            model: 'name'
          },
          {
            type: 'googleAddress',
            label: 'Address',
            model: 'address'
          },
          {
            type: 'input',
            inputType: 'url',
            label: 'URL',
            model: 'url'
          },
          {
            type: 'textArea',
            label: 'Description',
            model: 'description'
          },
          {
            type: 'input',
            inputType: 'hidden',
            model: '_id'
          },
          {
            type: 'submit',
            buttonText: 'Add',
            onSubmit: this.addLocation,
            styleClasses: 'btn'
          }
        ]
      }
    }
  },
  meteor: {
    locations() {
      let locations = []
      LocationsTable.find({}).forEach(function(l) {
        locations.push(l)
      })
      return locations
    }
  },
  methods: {
    addLocation: function() {
      if (this.location._id) {
        Metoer.call('updateLocation', this.location)
      } else {
        Meteor.call('addLocation', this.location)
        this.location = {
          name: '',
          address: '',
          url: ''
        }
      }
    },
    setLocation(lo) {
      this.location = lo
    },
    clearLocation() {
      this.location = {}
    }
  }
}
</script>

<style lang="css"></style>
