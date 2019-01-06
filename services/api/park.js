import {
  request
} from './settings'
// import PubSub from 'pubsub-js'
import moment from 'moment'
import _ from 'lodash'
export default {
  getParkShort (id) {
    return request({
      params: {
        call: 'Park/GetParkShortInfo',
        request: {
          ParkId: id
        }
      }
    })
  },
  getPark (id) {
    return request({
      params: {
        call: 'Park/GetParkDetails',
        request: {
          ParkId: id
        }
      }
    })
  },
  getOfficers (park) {
    return request({
      params: {
        call: 'Park/GetOfficers',
        request: {
          ParkId: park.ParkId
        }
      }
    })
  },
  getActivePlayers (park, params) {
    if (!params) {
      params = {}
    }
    params.ParkId = park
    return request({
      params: {
        call: 'Report/GetActivePlayers',
        request: params
      }
    })
  },
  getPlayers (park, token) {
    if (!park || !park.ParkId) {
      console.error('Invalid park passed', park)
    }
    return request({
      params: {
        call: 'Report/GetPlayerRoster',
        request: {
          Type: 'Park',
          Id: park.ParkId,
          Banned: 0
        }
      }
    })
  },
  deleteAttendance (token, entryId) {
    return request({
      params: {
        call: 'Attendance/RemoveAttendance',
        request: {
          Token: token,
          AttendanceId: entryId
        }
      }
    })
  },
  addAttendance (token, date, classId, park, kingdom, credits, player) {
    let data = new FormData()
    data.append('call', 'Attendance/AddAttendance')
    data.append('request[Token]', token)
    data.append('request[Date]', date)
    data.append('request[ClassId]', classId)
    if (park) {
      data.append('request[ParkId]', park)
    }
    data.append('request[KingdomId]', kingdom)
    data.append('request[Credits]', credits)
    data.append('request[MundaneId]', player)
    return request({
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: data
    })
  },
  getAttendance (park, date) {
    if (!park) {
      console.error('Invalid Park', park)
      return
    }
    return request({
      params: {
        call: 'Report/AttendanceForDate',
        request: {
          'Date': date,
          ParkId: park.ParkId
        }
      }
    })
  },
  getAttendanceDates (park, weeks, start) {
    let date = moment().format('Y-MM-DD')
    return request({
      params: {
        call: 'Report/AttendanceSummary',
        request: {
          ParkId: park.ParkId,
          PerWeeks: 1,
          Periods: weeks,
          ReportFromDate: (start) ? start : date
        }
      }
    })
  },
  getUniques (park, start, end) {
    start = moment(start)
    end = moment(end)
    let weeks = end.diff(start, 'week')
    let players = {}
    let uniquePlayerCount = 0
    let playerCount = 0
    let dates = []
    let resolved = []
    let month = {
      totalUnique: 0,
      averageUnique: 0,
      label: start.format('MMMM YYYY'),
      averageSignins: 0,
      totalSignins: 0,
      totalParkDays: 0,
      date: start.format('YYYYMMDD')
    }
    let report = new Promise((resolve, reject) => {
      this.getAttendanceDates(park, weeks, end.format('Y-MM-DD')).then(resp => {
        for (let i in resp.data.Dates) {
          let row = resp.data.Dates[i]
          let date = moment(row.Date)
          if (date.isBetween(start, end)) {
            dates.push(row.Date)
          }
        }
        if (dates.length == 0) {
          resolve(month)
        }
        let players = {}
        let playerCount = 0
        let uniquePlayerCount = 0
        for (let i in dates) {
          this.getAttendance (park, dates[i]).then(resp => {
            for (let p in resp.data.Attendance) {
              let log = resp.data.Attendance[p]
              if (!players.hasOwnProperty(log.MundaneId)) {
                players[log.MundaneId] = {
                  persona: log.Persona,
                  id: log.MundaneId,
                  park: log.FromParkName,
                  kingdom: log.FromKingdomName
                }
                uniquePlayerCount++
              }
              playerCount++
            }
            resolved.push(dates[i])
            if (_.difference(dates, resolved).length == 0) {
              month.averageUnique = Math.floor(uniquePlayerCount / dates.length)
              month.averageSignins = Math.floor(playerCount / dates.length)
              month.totalUnique = uniquePlayerCount
              month.totalSignins = playerCount
              month.totalParkDays = dates.length
              month.players = players
              resolve(month)
            }
          })
        }
      })
    })
    return report
  },
  getRoster (park, token) {
    console.log('sending request')
    return request({
      params: {
        call: 'Report/GetPlayerRoster',
        request: {
          Type: 'Park',
          Id: park.ParkId,
          Token: token
        }
      }
    })
  },
  getParks (kingdom) {
    let params = {
      call: 'Kingdom/GetParks',
      request: {}
    }
    if (kingdom) {
      params.request.KingdomId = kingdom
    }
    return request({
      params: params
    })
  },
  getClasses () {
    return request({
      params: {
        call: 'Attendance/GetClasses',
        request: {
          'Active': 1
        }
      }
    })
  }
}
