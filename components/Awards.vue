<template>
  <div class="text-left">
    <table class="table table-stripped table-hover">
      <thead>
        <th @click="sortAwards('name')">Award</th>
        <th @click="sortAwards('date')">Date</th>
        <th @click="sortAwards('grant')">Given By</th>
      </thead>
      <tbody>
        <tr v-for="award in awards">
          <td :title="award.Note">
            {{ award.IsLadder ? setOrder(award.Rank) : '' }}
            {{ award.KingdomAwardName }}
          </td>
          <td :title="award.EventName">{{ formatDate(award.Date) }}</td>
          <td>{{ award.GivenBy }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Players from '../services/api/player'
import moment from 'moment'
import Collection from 'lodash/collection'
export default {
  props: ['user'],
  data() {
    return {
      awards: []
    }
  },
  computed: {
    byDate() {
      return Collection.sortBy(this.awards, ['Date'])
    },
    byAward() {
      return Collection.sortBy(this.awards, ['KingdomAwardName', 'Date'])
    },
    byGrant() {
      return Collection.sortBy(this.awards, ['GivenById', 'Date'])
    }
  },
  methods: {
    sortAwards(by) {
      switch (by) {
        case 'date':
          this.awards = this.byDate
          break
        case 'name':
          this.awards = this.byAward
          break
        case 'grant':
          this.awards = this.byGrant
          break
      }
    },
    getAwards() {
      Players.getAwards(this.user).then(resp => {
        this.awards = resp.data.Awards
      })
    },
    setOrder(rank) {
      if (!rank) {
        return ''
      }
      let end = rank.length > 1 ? rank.slice(-1) : rank
      switch (end) {
        case 1:
          return `${rank}st`
        case 2:
          return `${rank}nd`
        case 3:
          return `${rank}rd`
        default:
          return `${rank}th`
      }
    },
    formatDate(date) {
      date = moment(date)
      return date.format('M/D/Y')
    }
  },
  watch: {
    user() {
      this.getAwards()
    }
  },
  mounted() {
    this.getAwards()
  }
}
</script>

<style></style>
