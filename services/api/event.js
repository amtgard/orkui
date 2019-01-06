import {
  request
} from './settings'
export default {
  create (event, token) {
    let data = new FormData()
    data.append('request[Name]', event.name)
    data.append('request[Price]', event.fee)
    data.append('request[EventId]', event.EventId)
    data.append('request[MundaneId]', event.mundaneId)
    data.append('call', 'Event/CreateEventDetails')
    data.append('request[Token]', token)
    return request({
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: data
    })
  },
  addAttendance (token, date, classId, eventDetailId, eventId, credits, player) {
    let data = new FormData()
    data.append('call', 'Attendance/AddAttendance')
    data.append('request[Token]', token)
    data.append('request[Date]', date)
    data.append('request[ClassId]', classId)
    data.append('request[EventCalendarDetailId]', eventDetailId)
    data.append('request[EventId]', eventId)
    data.append('request[Credits]', credits)
    data.append('request[MundaneId]', player)
    data.append('request[Type]', 'event')
    return request({
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: data
    })
  },
  fetch (filters) {
    return request({
      method: 'get',
      data: {
        call: 'Event/GetEventDetails',
        request: filters
      }
    })
  },
  fetchOne (id) {
    return request({
      method: 'get',
      data: {
        call: 'Events/GetEventDetail',
        request: {
          EventCalendarDetailId: id
        }
      }
    })
  },
  fetchTemplate (id) {
    return request({
      method: 'get',
      parms: {
        call: 'Events/GetEvent',
        request: {
          EventId: id
        }
      }
    })
  },
  fetchTemplates (filters) {
    return request({
      method: 'get',
      params: {
        call: 'Event/GetEvents',
        request: filters
      }
    })
  }
}
