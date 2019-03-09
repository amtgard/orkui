<template lang="html">
  <div id="activityReport">
    <h1>{{ park.name }}</h1>
    <button @click="init">
      <span class="glyphicon glyphicon-retweet" />
    </button>
    <div id="activityReport_officers">
      <h2>Officers</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Position</th>
            <th>Mundane Name</th>
            <th>Persona</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(officer) v-bind:key="id" in officers">
            <td>{{ officer.position }}</td>
            <td>{{ officer.name }}</td>
            <td>{{ officer.persona }}</td>
            <td>{{ officer.phone }}</td>
            <td>{{ officer.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="activityReport_signins">
      <h3>Signins</h3>
      <div class="row">
        <div class="col-sm-2 form-group">
          <label class="sr-only">
            Start Date
          </label>
          <input
            type="date" class="form-control" v-model="startField"
          />
        </div>
        <div class="col-sm-2 form-group">
          <label class="sr-only">
            End Date
          </label>
          <input
            type="date" class="form-control" v-model="endField"
          />
        </div>
        <div class="col-sm-2">
          <button
            class="btn btn-sm btn-default" @click="getSignins"
          >
            Run
          </button>
        </div>
      </div>
      <span
        class="muted"
      >
        Report from {{ start.format('MMMM D, YYYY') }} to
        {{ end.format('MMMM D, YYYY') }}
      </span>
      <ul>
        <li>Total Unique Sign-Ins: {{ signins.totalUnique }}</li>
        <li>Months: {{ signins.months.length }}</li>
        <li>Average Unique Sign-Ins: {{ signins.averageUnique }}</li>
        <li v-for="month in signins.months">
          {{ month.label }}:
          <ul>
            <li>Meetings: {{ month.totalParkDays }}</li>
            <li>Average Signins: {{ month.averageSignins }}</li>
            <li>Total Signins: {{ month.totalSignins }}</li>
            <li>Total Unique Signins: {{ month.totalUnique }}</li>
            <li>Average Unique Signins: {{ month.averageUnique }}</li>
          </ul>
        </li>
      </ul>
    </div>
    <div id="activityReport_location">
      <h3>Park Details</h3>
      <ul>
        <li>
          <h4>Location:</h4>
          {{ location }}
        </li>
        <li>
          <h4>Dues Paid Citizens</h4>
          <ul>
            <li v-for="player in duesPaid">
              {{ player.Persona }}
              <small class="text-muted">
                ({{ player.DuesThrough }})
              </small>
            </li>
            <li>
              <h5>Notes:</h5>
              {{ duesNotes }}
            </li>
          </ul>
        </li>
        <li>
          <h4>Financial Ledger</h4>
          {{ ledger }}
        </li>
        <li>
          <h4>Awards</h4>
          <ul>
            <li v-for="award in awards" />
          </ul>
        </li>
      </ul>
    </div>
    <div id="activityReport_althing">
      <h3>Althing Notes</h3>
      <ul>
        <li v-for="note in althingNotes">
          {{ note.label }}: {{ note.note }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Parks from '~/services/api/park'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
export default {
  name: 'ActivityReport',
  props: ['park', 'players'],
  data() {
    return {
      start: moment()
        .startOf('month')
        .subtract(3, 'months'),
      end: moment()
        .endOf('month')
        .subtract(1, 'months'),
      officers: [],
      signins: {
        total: 0,
        totalUnique: 0,
        months: []
      },
      location: null,
      duesPaid: [],
      duesNotes: '',
      althingNotes: [],
      awards: [],
      ledger: null
    }
  },
  computed: {
    ...mapGetters({
      token: 'getToken'
    }),
    startField: {
      get() {
        return this.start.format('YYYY-MM-DD')
      },
      set(value) {
        this.start = moment(value)
      }
    },
    endField: {
      get() {
        return this.end.format('YYYY-MM-DD')
      },
      set(value) {
        this.end = moment(value)
      }
    }
  },
  watch: {
    park() {
      this.init
    }
  },
  mounted() {
    if (this.park && this.park.ParkId) {
      this.init()
    }
  },
  methods: {
    getPlayers() {
      let duesPaid = []
      let current = moment()
      for (let i in this.players) {
        let row = this.players[i]
        if (row.DuesThrough && moment(row.DuesThrough).isAfter(current)) {
          duesPaid.push(row)
        }
      }
      this.duesPaid = duesPaid
    },
    getOfficers() {
      this.officers = []
      let officers = []
      Parks.getOfficers(this.park).then(resp => {
        if (!resp.data.Officers) {
          return
        }
        for (i in resp.data.Officers) {
          let row = resp.data.Officers[i]
          let officer = {
            position: row.OfficerRole,
            name: row.GivenName + ' ' + row.Surname,
            phone: '',
            email: '',
            persona: row.Persona
          }
          officers.push(officer)
        }
        this.officers = officers
      })
    },
    getSignins() {
      let start = moment(this.start.format('YYYY-MM-DD'))
      let end = moment(this.start.format('YYYY-MM-DD'))
      end.endOf('month')
      this.signins.months = []
      this.signins.totalUnique = 0
      while (start < this.end) {
        Parks.getUniques(this.park, start, end).then(val => {
          this.signins.months.push(val)
          this.signins.totalUnique += val.totalUnique
          this.signins.averageUnique = Math.ceil(
            this.signins.totalUnique / this.signins.months.length
          )
          this.signins.months = _.orderBy(this.signins.months, ['date'])
        })

        start.add(1, 'months')
        end = moment(start).endOf('month')
      }
    },
    init() {
      this.getPlayers()
      this.getOfficers()
      this.getSignins()
      this.location = this.park.Address
    }
  }
}
</script>
