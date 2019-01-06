<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      Attendance
      <button @click="getAttendance">Reload</button>
    </div>
    <div class="panel-body">
      <div class="col-md-6 text-left">
        <div class="form-group">
          <label for="Date">Date</label>
          <input type="date" v-model="date" class="form-control" />
        </div>
        <div class="form-group">
          <label for="Kingdom">Kingdom</label>
          <v-select :options="kingdomOptions" label="KingdomName" v-model="kingdom"></v-select>
          <div class="help-block">
          </div>
        </div>
        <div class="form-group">
          <label for="Park">Park</label>
          <v-select :options="parks" v-model="activePark" label="Name"></v-select>
        </div>
        <div class="form-group">
          <label for="Player">Player</label>
          <v-select :options="playerOptions" v-model="playerId"></v-select>
        </div>
        <div class="form-group col-md-6">
          <label for="Class">Class</label>
          <select class="form-control" v-model="classId">
            <option v-for="skill in classes" :value="skill.ClassId">{{ skill.Name }}</option>
          </select>
        </div>
        <div class="form-group col-md-6">
          <label for="Credits">Credits</label>
          <input type="number" v-model="credits" class="form-control" />
        </div>
        <div class="form-group">
          <button type="button" class="btn btn-primary" @click="send">Enter Attendance</button>
        </div>
      </div>
      <div class="col-md-6 list-group">
        <div>
          {{ date }}
        </div>
        <div v-for="item in attendance" class="list-group-item">
          <button class="btn btn-xs pull-right" @click="edit(item)">
            <span class="glyphicon glyphicon-pencil"></span>
          </button>
          <button class="btn btn-xs btn-danger pull-right" @click="removeAttendance(item.id)">
            <span class="glyphicon glyphicon-remove"></span>
          </button>
          <p>
            {{ item.Persona }}
            <span class="text-muted">{{ item.Credits }} Credit in {{ item.ClassName }}</span>
          </p>
          <span class="text-muted">
            {{ item.FromKingdomName }}::{{ item.FromParkName }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Parks from "../services/api/park";
import Collections from "lodash/collection";
import Moment from "moment";
import PubSub from "pubsub-js";
import vSelect from "vue-select";
import Vue from "vue";
Vue.component("v-select", vSelect);
export default {
    props: ["park"],
    data() {
        return {
            classes: [],
            parks: [],
            players: [],
            attendance: [],
            credits: 1,
            kingdomId: null,
            kingdom: null,
            parkId: null,
            selectedpark: null,
            classId: null,
            playerId: null,
            date: null,
            activePark: null,
            id: null
        };
    },
    computed: {
        ...mapGetters({
            kingdoms: "getKingdoms",
            token: "getToken"
        }),
        playerOptions() {
            let players = [];
            for (let i in this.players) {
                players.push({
                    label: this.players[i].Persona,
                    value: this.players[i]
                });
            }
            return players;
        },
        kingdomOptions() {
            let kingdoms = [];
            for (let i in this.kingdoms) {
                kingdoms.push(this.kingdoms[i]);
            }
            return kingdoms;
        }
    },
    methods: {
        send() {
            if (this.id) {
                this.removeAttendance(this.id);
            }
            let date = Moment(this.date);
            Parks.addAttendance(
                this.token,
                date.format("Y-MM-DD"),
                this.classId,
                this.park.ParkId,
                this.kingdom.KingdomId,
                this.credits,
                this.playerId.value.MundaneId
            ).then(resp => {
                if (resp.data.Error === "Success") {
                    PubSub.publish("alerts.add", {
                        key: "addattendance",
                        message: "Attendance Added",
                        timestamp: Date().toString(),
                        type: "success"
                    });
                    this.id = null;
                    this.playerId = null;
                    this.classId = null;
                } else {
                    PubSub.publish("alerts.add", {
                        key: "addattendance",
                        message: "Error adding attendance: " + resp.data.Error,
                        timestamp: Date().toString(),
                        type: "warning"
                    });
                }
                this.getAttendance();
            });
        },
        getParks() {
            if (!this.kingdom || !this.kingdom.KingdomId) {
                return [];
            }
            Parks.getParks(this.kingdom.KingdomId).then(resp => {
                let parks = [];
                for (let i in resp.data.Parks) {
                    parks.push({
                        Name: resp.data.Parks[i].Name,
                        ParkId: resp.data.Parks[i].ParkId,
                        KingdomId: resp.data.Parks[i].KingdomId
                    });
                }
                this.parks = parks;
            });
        },
        getPlayers() {
            if (!this.activePark) {
                return [];
            }
            Parks.getPlayers(this.activePark, this.token).then(resp => {
                this.players = resp.data.Roster;
            });
        },
        getAttendance() {
            Parks.getAttendance(this.park, this.date).then(resp => {
                if (resp.data.Attendance) {
                    this.attendance = resp.data.Attendance;
                } else {
                    this.attendance = [];
                }
            });
        },
        edit(item) {
            this.date = item.Date;
            this.classId = item.ClassId;
            this.kingdom = Collections.find(this.kingdoms, {
                KingdomId: item.KingdomId
            });
            this.activePark = Collections.find(this.parks, {
                ParkId: item.ParkId
            })
            this.credits = item.Credits;
            this.playerId = item.MundaneId;
            this.id = item.AttendanceId;
        },
        removeAttendance(id) {
            Parks.deleteAttendance(this.token, id).then(resp => {
                this.getAttendance();
            });
        },
        setPark () {
            this.parks.push(this.park);
            this.kingdomId = this.park.KingdomId;
            this.kingdom = Collections.find(this.kingdoms, {
              KingdomId: this.park.KingdomId
            });
            this.getParks();
            this.parkId = this.park.ParkId;
            this.activePark = {
                Name: this.park.ParkName,
                ParkId: this.park.ParkId,
                KingdomId: this.park.KingdomId
            }
        }
    },
    watch: {
        kingdom() {
            this.parks = [];
            this.players = [];
            this.getParks();
        },
        activePark() {
            this.players = [];
            this.getPlayers();
        },
        date() {
            this.getAttendance();
        },
        park () {
          this.setPark()
        }
    },
    mounted() {
        if (this.park) {
          this.setPark()
        }
        this.getParks();
        this.getPlayers();
        this.$store.dispatch("getKingdoms");
        Parks.getClasses().then(resp => {
            this.classes = resp.data.Classes;
        });
    }
};
</script>

<style>
</style>
