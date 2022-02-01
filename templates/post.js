const { renderMarkdown, markdownOptions } = require('../helpers/markdown')
const { view: feedView } = require('./feed')
const { convertLegacySSB } = require('../helpers/url')
const { getLocalTime, earliestTimeStamp } = require('../helpers/time')
const { render } = require('mustache')

const html = h => h

const view = {
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

  mentionsHeading: function () {
    if (this.value?.content?.mentions?.length > 0) return '<hr><h3>Article links</h3></br>'
    else return ''
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

  postMarkdown: function () {
    return renderMarkdown(this.value.content.text, markdownOptions)
  }
}

const template = html`
  <article>
    <div id="author"></div>
    
    {{#profile}}
      <section>
        <img src="{{imageUrl}}" />
        <p><a href="{{feedUrl}}" class="link"><b>{{name}}</b></a></p>
        <p>{{{descriptionOneLine}}}</p>
        <hr>
      </section>
    {{/profile}}

    <p>
      <b>{{publishedOn}}</b>
    </p>

    <div>
      {{{postMarkdown}}}
    </div>

    </br>

    {{{mentionsHeading}}}
    <ol>
      {{ #value.content.mentions }}
        <li>
          <cite>
            {{name}}: <a href="{{mentionsLink}}">{{mentionsLink}}</a>
          </cite>
        </li>
      {{ /value.content.mentions }}
    </ol>
    
  </article>
  <style>
    cite {
      font-size: x-small;
    }

    #author > section > p {
      font-size: large;
      color: var(--ag-theme-primary);
      filter: brightness(1.75);
    }
  </style>
`

module.exports = {
  template: template[0],
  view
}
