const { format: pretty, utcToZonedTime } = require('date-fns-tz')
const enGB = require('date-fns/locale/en-GB')

module.exports = { getLocalTime, earliestTimeStamp }

/**
 *  utcToZonedTime(date: Date|Number|String, timeZone: String): Date
 */
function localDateTime(date, timezone) {
  return utcToZonedTime(date, timezone)
}

function localTime(date, { format, timeZone }) {
  return pretty(localDateTime(date, timeZone), format, {
    timeZone,
    locale: enGB // todo: get user locale
  })
}

function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

function getLocalTime(date, format = 'yyyy-MM-dd HH:mm:ss zzzz') {
  const timeZone = getTimezone()
  return localTime(date, { format, timeZone })
}

function earliestTimeStamp(message) {
  return Math.min(message?.timestamp, message?.value?.timestamp)
}
