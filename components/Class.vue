<template>
  <div class="text-left">
    <table class="table table-striped table-hover table-condenced">
      <thead>
        <th>Class</th>
        <th>Level</th>
        <th>Credits</th>
      </thead>
      <tbody>
        <tr v-for="skill in classes">
          <td>{{ skill.ClassName }}</td>
          <td>{{ getLevel(skill) }}</td>
          <td>{{ skill.Credits }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Players from '../services/api/player'
export default {
  props: ['player'],
  data() {
    return {
      classes: []
    }
  },
  methods: {
    getLevel(skill) {
      let weeks = skill.Credits
      switch (true) {
        case weeks < 5:
          return 1
        case weeks >= 5 && weeks < 12:
          return 2
        case weeks >= 12 && weeks < 21:
          return 3
        case weeks >= 21 && weeks < 34:
          return 4
        case weeks >= 34 && weeks < 53:
          return 5
        case weeks >= 53:
          return 6
      }
    },
    getClasses() {
      Players.getClasses(this.player).then(resp => {
        this.classes = resp.data.Classes
      })
    }
  },
  mounted() {
    this.getClasses()
  },
  watch: {
    player() {
      this.getClasses()
    }
  }
}
</script>

<style></style>
