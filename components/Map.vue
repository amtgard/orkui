<template>
  <div>
    <gmap-map :center="center" :zoom="10" style="width: 100%; height: 300px">
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center = m.position"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
import VueGoogleMaps from 'vue-googlemaps'
import Vue from 'vue'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBbood1j_Vx0nhxp3q_JMi_0XFuIIjwSoc',
    libraries: ['Places']
  }
})

export default {
  props: ['geoData'],
  computed: {
    center() {
      return {
        lat: this.geoData.location.lat,
        lng: this.geoData.location.lng
      }
    },
    markers() {
      return [
        {
          position: {
            lat: this.geoData.location.lat,
            lng: this.geoData.location.lng
          }
        }
      ]
    }
  }
}
</script>
