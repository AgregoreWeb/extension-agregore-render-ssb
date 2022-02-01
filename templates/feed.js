const { renderMarkdown, renderTitle } = require('../helpers/markdown')
const { convertLegacySSB } = require('../helpers/url')

const html = h => h

const view = {
  feedUrl: function () {
    return convertLegacySSB(this.id)
  },
  imageUrl: function () {
    const url = this.image?.link ? convertLegacySSB(this.image.link) : null
    return url
  },
  descriptionMd: function () {
    const md = this.description ? renderMarkdown(this.description) : null
    return md
  },
  descriptionOneLine: function () {
    const md = this.description ? renderTitle(this.description) : null
    return md
  }
}

const template = html`
  <section>
    <b>{{name}}</b></br>
    <b>{{{descriptionMd}}}</b></br>
    <img src="{{imageUrl}}" />
  </section>
`

module.exports = {
  template: template[0],
  view
}
