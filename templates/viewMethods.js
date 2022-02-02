const { getLocalTime, earliestTimeStamp } = require('../helpers/time')
const { convertLegacySSB } = require('../helpers/url')
const { render } = require('mustache')
const { view: feedView } = require('./feed')

module.exports = {
  publishedOn: function () {
    return getLocalTime(earliestTimeStamp(this), 'yyyy-MM-dd EEEE HH:mm')
  },

  profile: function () {
    return function (text) {
      const self = this
      async function renderAuthor() {
        const response = await fetch(convertLegacySSB(self.value.author))
        const json = await response.json()
        document.getElementById('author').innerHTML = await render(text, { ...json, ...feedView })
      }
      renderAuthor()
    }
  },

  mentionsLink: function () {
    /** try to convert link - if it fails it's not an ssb link */
    // todo: are hashtags a special case we need to convert?
    try {
      const link = convertLegacySSB(this.link)
      return link
    } catch (error) {
      // console.log('error converting link', this.link, error)
    }
    /** return non-ssb link */
    return this.link
  },

  rootMessageLink: function () {
    if (this.value.content.root) return `<a href="${convertLegacySSB(this.value.content.root)}">Root Msg</a>`
    else return ''
  },

  branchMessageLink: function () {
    if (this.value.content.root) return `<a href="${convertLegacySSB(this.value.content.branch)}">In Reply To</a>`
    else return ''
  }
}
