<template lang="html">
  <div class="content-container">
      <form class="form" @submit.prevent="onSubmit">
          <div class="form-group">
              <label>Name</label>
              <input type="text" required v-model="cabin.name" class="form-control">
          </div>
          <div class="form-group">
              <label>Bunks</label>
              <input type="number" required min="1" v-model="cabin.bunks" class="form-control">
          </div>
          <div class="btn-group">
              <button type="submit" class="btn btn-primary">{{ (cabin._id) ? 'Save' : 'Add Cabin'}}</button>
          </div>
      </form>
      <div class="side-list list-group" v-if="cabin.location">
          <div class="list-group-heading">
          </div>
          <div class="list-group-item" v-for="cab in cabins">
              <button type="button" class="btn btn-xs" name="button" v-on:click="editCabin(cab)">
                  <span class="glyphicon glyphicon-pencil"></span>
              </button>
              <button type="button" class="btn btn-xs btn-danger" name="button" v-on:click="removeCabin(cab)">
                  <span class="glyphicon glyphicon-trash"></span>
              </button>
              {{ cab.name }}, bunks: {{ cab.bunks }}
          </div>
      </div>
  </div>
</template>

<script>
import {
    LocationsTable
} from '/collections/LocationsTable'
import {
    CabinsTable
} from '/collections/CabinsTable'
import collection from 'lodash/collection'
export default {
  props: ['location'],
    data() {
      return {
        cabin: {
          name: '',
          bunks: '',
          location: this.location._id
        },
        locations: [],
        activeLocation: null,
        cabins: [],
      }
    },
    watch: {
      location () {
        this.fetchCabins()
      }
    },
    methods: {
      fetchCabins () {
        if (!this.location) {
          return []
        }
        this.cabins = CabinsTable.find({location: this.location._id}).fetch()
      },
      onSubmit: function() {
        if (this.cabin._id) {
          Meteor.call('updateCabin', this.cabin, () => {
            this.cabin = {
              location: this.location._id
            }
            this.fetchCabins()
          })
        } else {
          Meteor.call('addCabin', this.cabin, () => {
            this.cabin = {
              location: this.location._id
            }
            this.fetchCabins()
          })
        }
      },
      removeCabin: function(cabin) {
        Meteor.call('removeCabin', cabin)
      },
      editCabin(cabin) {
        this.cabin = cabin
      }
    },
    created () {
      this.fetchCabins()
    }
}
</script>

<style lang="css">
</style>
