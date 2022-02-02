const { publishedOn, profile, mentionsLink, rootMessageLink, branchMessageLink } = require('./viewMethods')

const html = h => h

const view = {
  publishedOn,
  profile,
  mentionsLink,
  rootMessageLink,
  branchMessageLink,

  prettyPrint: function () {
    return JSON.stringify(this, null, 2)
  },

  mentionsHeading: function () {
    if (this.value?.content?.mentions?.length > 0) return '<hr><h3>Links</h3></br>'
    else return ''
  }
}

const template = html`
  <article>
    <div id="author"></div>
    
    {{#profile}}
      <section>
        <img src="{{imageUrl}}" />
        <p><a href="{{feedUrl}}" class="profile-name"><b>{{name}}</b></a></p>
        <p>{{{descriptionOneLine}}}</p>
        <hr>
      </section>
    {{/profile}}

    <p>
      <b>{{publishedOn}}</b>
    </p>

    <p>
      {{{ rootMessageLink }}}
      {{{ branchMessageLink }}}
    </p>

    <pre>{{prettyPrint}}</pre>

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

    .profile-name {
      font-size: large;
      color: var(--ag-theme-primary);
      filter: brightness(1.5);
    }

    #author > section > p {
      font-size: large;
      color: var(--ag-theme-secondary);
    }
  </style>
`

module.exports = {
  template: template[0],
  view
}
