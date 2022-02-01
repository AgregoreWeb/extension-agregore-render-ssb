const { getLocalTime } = require('./time')

module.exports = {
  isPost,
  isAbout,
  earliestTimeStamp,
  insertMetadata
}

function isPost(message) {
  return message?.value?.content?.type === 'post' && !!message?.value?.content?.text
}

function isAbout(message) {
  return message?.value?.content?.type === 'about' && !!message?.value?.content?.about
}

function earliestTimeStamp(message) {
  return Math.min(message?.timestamp, message?.value?.timestamp)
}

function insertMetadata(message) {
  return `${message?.value?.author} ${getLocalTime(earliestTimeStamp(message))}\n\n`
}
