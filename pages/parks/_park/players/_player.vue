<template>
  <div>
    <div class="playerTitle breadcrumb">
      <nuxt-link :to="`/kingdoms/${kingdom.KingdomId}`">
        <span class="h2">{{ kingdom.KingdomName }}</span>
      </nuxt-link>/
      <nuxt-link :to="`/parks/${park.ParkId}`">
        <span class="h2">{{ park.ParkName }}</span>
      </nuxt-link>/
      <span class="h2">{{ player.Persona }}</span>
    </div>
    <div class="playerData">
      <div class="images">
        <div class="avatar" v-if="player.HasImage">
          <img
            :src="'https:' + player.Image"
            alt="Player has no image"
            title="Player image"
            class="img-responsive img-rounded"
          >
        </div>
        <div class="avatar" v-if="player.HasHeraldry">
          <img
            :src="'https:' + player.Heraldry"
            alt="Player has no heraldry"
            title="Player heraldry"
            class="img-responsive img-rounded"
          >
        </div>
      </div>
      <div class="details">
        <span class="h3">Details</span>
        <table class="table table-striped">
          <tbody>
            <tr>
              <th>Player</th>
              <td>{{ (player.GivenName) ? player.GivenName + ' ' + player.Surname : '' }}</td>
              <th>Persona</th>
              <td>{{ player.Persona }}</td>
            </tr>
            <tr>
              <th>Username</th>
              <td>{{ player.UserName }}</td>
              <th>Email</th>
              <td>
                <a :href="'mailto:' + player.Email">{{ player.Email }}</a>
              </td>
            </tr>
            <tr>
              <th>Kingdom</th>
              <td>
                <nuxt-link
                  :to="{ name: 'Parks', params: { kingdomId: player.KingdomId } }"
                >{{ player.KingdomName }}</nuxt-link>
              </td>
              <th>Park</th>
              <td>
                <nuxt-link
                  :to="{ name: 'Park', params: { parkId: player.ParkId } }"
                >{{ player.ParkName }}</nuxt-link>
              </td>
            </tr>
            <tr v-if="player.Notes && player.Notes.length > 0">
              <td colspan="4">
                <span class="h4">Notes</span>
                <span class="glyphicon" :class="toggleClass(notes)" @click="toggleNotes"></span>
                <ul :class="notes">
                  <li v-for="note in player.Notes" :key="note.id">
                    <div>
                      <span class="text-muted">{{ note.Date }} {{ note.GivenBy }}</span>
                      {{ note.Note }}
                      <blockquote
                        v-if="note.Description && note.Description.length > 0"
                        class="text-muted"
                      >
                        <small>{{ note.Description }}</small>
                      </blockquote>
                    </div>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="grid">
      <div class="awards">
        <span class="h3">Awards</span>
        <span class="glyphicon pull-right" :class="toggleClass(awards)" @click="toggleAwards"></span>
        <Awards :class="awards" :user="player"></Awards>
      </div>
      <div class="classes">
        <span class="h3">Classes</span>
        <span class="glyphicon pull-right" :class="toggleClass(classes)" @click="toggleClasses"></span>
        <Classes :player="player" :class="classes"></Classes>
      </div>
    </div>
  </div>
</template>

<script>
import Classes from '~/components/Class'
import Awards from '~/components/Awards'
import Collection from 'lodash/collection'
export default {
  components: {
    Classes: Classes,
    Awards: Awards
  },
  data() {
    return {
      notes: 'show',
      classes: 'show',
      awards: 'show'
    }
  },
  computed: {
    player() {
      return this.$store.state.players.player || {}
    },
    mundaneId() {
      return this.$route.params.player
    },
    kingdom() {
      return (
        Collection.find(this.$store.state.kingdoms.kingdoms, {
          KingdomId: this.player.KingdomId
        }) || {}
      )
    },
    park() {
      return (
        Collection.find(this.$store.state.parks.parks, {
          ParkId: this.player.ParkId
        }) || {}
      )
    }
  },
  watch: {
    mundaneId() {
      this.getPlayer()
    }
  },
  mounted() {
    this.getPlayer()
  },
  methods: {
    getPlayer() {
      let player =
        this.player.MundaneId && this.player.MundaneId == this.mundaneId
          ? this.player
          : { MundaneId: this.mundaneId }
      this.$store.dispatch('players/fetchPlayer', player).then(() => {
        if (!this.kingdom.KingdomId) {
          this.$store.dispatch('kingdoms/fetchKingdom', player.KingdomId)
        }
        if (!this.park.ParkId) {
          this.$store.dispatch('parks/fetchPark', player.ParkId)
        }
      })
    },
    toggleNotes() {
      this.notes = this.notes == 'hide' ? 'show' : 'hide'
    },
    toggleClasses() {
      this.classes = this.classes == 'hide' ? 'show' : 'hide'
    },
    toggleAwards() {
      this.awards = this.awards == 'hide' ? 'show' : 'hide'
    },
    toggleClass(state) {
      return state == 'hide' ? 'glyphicon-chevron-down' : 'glyphicon-chevron-up'
    }
  }
}
</script>

<style lang="scss" scoped="scoped">
.avatar {
  padding: 1em;
  width: 175px;
  img {
    height: auto;
    width: 100%;
    border-radius: 20px;
  }
}

.images {
  padding: 0 2em;
}

td {
  text-align: left;
}

.playerData {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 10em calc(65% - 5em);
  grid-column-gap: 5em;
  align-items: start;
  width: 90vw;
}

.playerTitle {
  grid-column: 2 / span 2;
  grid-row: 1;
  margin-bottom: 2em;
}

.playerImages {
  grid-column: 1;
  grid-row-start: 1;
  grid-row-end: 4;
}

.grid {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  grid-auto-rows: 40px;
  width: 90vw;
  align-content: center;
}

.awards {
}

.classes {
}

@media (max-width: 1050px) {
  .avatar {
    padding: 5px;
  }
  .playerData {
    display: grid;
    grid-template-columns: 10vw 65vw;
    grid-column-gap: 0.5em;
    grid-auto-rows: minmax(60px, auto);
    align-items: start;
  }
  .playerTitle {
    grid-column: 2;
    grid-row: 1;
    margin-bottom: 2em;
  }

  .playerImages {
    grid-column: 1;
    grid-row-start: 1;
    grid-row-end: 4;
  }

  .details {
    grid-column: 2;
    grid-row-start: 2;
  }
  .awards {
    grid-column: 2;
    grid-row-start: 4;
  }

  .classes {
    grid-column: 2;
    grid-row-start: 3;
  }
}
</style>
