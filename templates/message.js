const html = h => h

const view = {
  prettyPrint: function () {
    return JSON.stringify(this, null, 2)
  }
}

const template = html`
<main class="h-screen bg-purple-400 flex items-center justify-center">
  <b>key: {{key}}</b></br>
  <b>author: {{value.author}}</b></br>
  <b>unixtime: {{value.timestamp}}</b></br>
  <b>msg type: {{value.content.type}}</b></br>

  <pre>{{prettyPrint}}</pre>
</main>
`

module.exports = {
  template: template[0],
  view
}
