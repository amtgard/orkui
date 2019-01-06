<template>
<div class="container playerData">
    <div class="playerTitle">
        <span class="h2">{{ playerDetails.Persona }}</span>
    </div>
    <div class="playerImages" v-if="playerDetails.HasImage || playerDetails.HasHeraldry">
        <div class="avatar">
            <img :src="'https:' + playerDetails.Image" alt="Player has no image" title="Player image" class="img-responsive img-rounded">
        </div>
        <div class="avatar">
            <img :src="'https:' + playerDetails.Heraldry" alt="Player has no heraldry" title="Player heraldry" class="img-responsive img-rounded">
        </div>
    </div>
    <div class="details">
        <span class="h3">Details</span>
        <table class="table table-striped">
            <tbody>
                <tr>
                    <th>Player</th>
                    <td>{{ (playerDetails.GivenName) ? playerDetails.GivenName + ' ' + playerDetails.Surname : ''}}</td>
                    <th>Persona</th>
                    <td>{{ playerDetails.Persona }}</td>
                </tr>
                <tr>
                    <th>Username</th>
                    <td>{{ playerDetails.UserName }}</td>
                    <th>Email</th>
                    <td><a :href="'mailto:' + playerDetails.Email">{{ playerDetails.Email }}</a></td>
                </tr>
                <tr>
                    <th>Kingdom</th>
                    <td>
                        <router-link :to="{ name: 'Parks', params: { kingdomId: playerDetails.KingdomId } }">{{playerDetails.KingdomName}}</router-link>
                    </td>
                    <th>Park</th>
                    <td>
                        <router-link :to="{ name: 'Park', params: { parkId: playerDetails.ParkId } }">{{playerDetails.ParkName}}</router-link>
                    </td>
                </tr>
                <tr v-if="playerDetails.Notes && playerDetails.Notes.length > 0">
                    <td colspan="4">
                        <span class="h4">Notes</span>
                        <span class="glyphicon" :class="toggleClass(notes)" @click="toggleNotes"></span>
                        <ul :class="notes">
                            <li v-for="note in playerDetails.Notes">
                                <div>
                                    <span class="text-muted">{{ note.Date }} {{ note.GivenBy }}</span> {{ note.Note }}
                                    <blockquote v-if="note.Description && note.Description.length > 0" class="text-muted">
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
    <div class="awards">
        <span class="h3">Awards</span>
        <span class="glyphicon pull-right" :class="toggleClass(awards)" @click="toggleAwards"></span>
        <Awards :class="awards" :user="playerDetails"></Awards>
    </div>
    <div class="classes">
        <span class="h3">Classes</span>
        <span class="glyphicon pull-right" :class="toggleClass(classes)" @click="toggleClasses"></span>
        <Classes :player="playerDetails" :class="classes"></Classes>
    </div>
</div>
</template>

<script>
import Players from '../services/api/player'
import Parks from '../services/api/park'
import {
    mapGetters
} from 'vuex'
import Classes from './Class'
import Awards from './Awards'
export default {
    props: ['player'],
    components: {
        Classes: Classes,
        Awards: Awards
    },
    data() {
        return {
            playerDetails: {},
            notes: 'show',
            classes: 'show',
            awards: 'show'
        }
    },
    computed: {
        ...mapGetters({
            token: 'getToken'
        })
    },
    methods: {
        getPlayer() {
            let token = this.token
            let player = {}
            if (!this.player && this.$route.params.playerId) {
                Parks.getParkShort(this.$route.params.parkId).then(resp => {
                    player.ParkName = resp.data.ParkInfo.ParkName
                    player.ParkId = resp.data.ParkInfo.ParkId
                    player.KingdomName = resp.data.KingdomInfo.KingdomName
                    player.KingdomId = resp.data.KingdomInfo.KingdomId
                })
                player.MundaneId = this.$route.params.playerId
                Players.getPlayer(player, token).then((resp) => {
                    this.playerDetails = Object.assign(player, resp.data.Player)
                    Players.getNotes(player, token).then(resp => {
                        this.playerDetails.Notes = resp.data.Result
                    })
                })
            } else {
                player = this.player
                Players.getPlayer(player, token).then((resp) => {
                    this.playerDetails = Object.assign(player, resp.data.Player)
                })
            }
        },
        toggleNotes() {
            this.notes = (this.notes == 'hide') ? 'show' : 'hide'
        },
        toggleClasses() {
            this.classes = (this.classes == 'hide') ? 'show' : 'hide'
        },
        toggleAwards() {
            this.awards = (this.awards == 'hide') ? 'show' : 'hide'
        },
        toggleClass(state) {
            return (state == 'hide') ? 'glyphicon-chevron-down' : 'glyphicon-chevron-up'
        }
    },
    watch: {
        player(val) {
            this.getPlayer()
        }
    },
    mounted() {
        this.getPlayer()
    }
}
</script>

<style scoped="scoped">
.avatar {
    padding: 1em;
}

td {
    text-align: left;
}

.playerData {
    display: grid;
    grid-template-columns: 10em calc(65% - 5em) calc(25% - 5em);
    grid-column-gap: 1em;
    grid-auto-rows: minmax(60px, auto);
    align-items: start;
}

.playerTitle {
    grid-column: 2 /span 2;
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
    grid-row-start: 3;
}

.classes {
    grid-column: 3;
    grid-row-start: 2;
    grid-row-end: 4;
}

@media (max-width: 1050px) {
  .avatar {
    padding: 5px;
  }
  .playerData {
    display: grid;
    grid-template-columns: 10vw 65vw;
    grid-column-gap: .5em;
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
