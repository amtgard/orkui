<template lang="html">
  <div id="system-alerts">
    <div
      v-for="alert in alerts"
      :key="alert.timestamp"
      :class="'animated alert alert-dismissible alert-' + alert.type"
      role="alert"
    >
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
        @click="clearAlert(alert)"
      >
        <span
          class="glyphicon glyphicon glyphicon-remove" 
          aria-hidden="true"
        />
      </button>
      <span class="badge pull-right">
        {{ alert.timestamp }}
      </span>
      {{ alert.message }}
    </div>
  </div>
</template>

<script>
import PubSub from 'pubsub-js'
import Array from 'lodash/array'

export default {
  data() {
    return {
      alerts: []
    }
  },
  mounted() {
    PubSub.subscribe('alerts.add', this.addAlert)
  },
  methods: {
    addAlert(topic, alert) {
      if (undefined === alert.key) {
        return false
      }
      this.alerts.push(alert)
      setTimeout(() => {
        this.clearAlert(alert)
      }, 15000)
    },
    clearAlert(alert) {
      let index = Array.findIndex(this.alerts, function(a) {
        return a.key === alert.key
      })
      this.alerts.splice(index, 1)
    }
  }
}
</script>

<style lang="css"></style>
