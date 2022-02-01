const Mustache = require('mustache')
const { parseUrlType } = require('./helpers/url')
const { renderTitle } = require('./helpers/markdown')
const { post: postTemplate, feed: feedTemplate, message: messageTemplate } = require('./templates')
const { isPost } = require('ssb-fetch/utils')
const hljs = require('highlight.js/lib/common')

const shouldRender = location.protocol === 'ssb:' && document.contentType.includes('application/json')

console.log('extension-render-ssb shouldRender', shouldRender)

/* global location */
if (shouldRender) {
  console.log('extension-agregore-render-ssb-posts init')
  let json, preElement, message
  try {
    preElement = document.querySelector('pre')
    json = preElement.innerText
    message = JSON.parse(json)
  } catch (error) {
    throw new Error(`extension-agregore-render-ssb: Error rendering ssb content ${error}`)
  }

  async function main() {
    const title = renderTitle(message.value?.content?.text)

    const { template, view } = await selectTemplateView(message)
    const mergedView = { ...message, ...view }
    const rendered = await Mustache.render(template, mergedView)

    const style = document.createElement('style')
    style.innerHTML = `
      @import url("agregore://theme/vars.css");
      @import url("agregore://theme/style.css");
      @import url("agregore://theme/highlight.css");
    `
    document.head.appendChild(style)

    const root = document.createElement('webview')
    root.setAttribute('id', 'content')
    root.innerHTML = rendered
    document.title = title

    /** attach ssb content to the dom */
    document.body.replaceChild(root, preElement)

    /** highlight headings the agregore way */
    const toAnchor = document.querySelectorAll('h1[id],h2[id],h3[id],h4[id]')
    console.log('Anchoring', toAnchor)

    for (let element of toAnchor) {
      const anchor = document.createElement('a')
      anchor.setAttribute('href', '#' + element.id)
      anchor.setAttribute('class', 'agregore-header-anchor')
      anchor.innerHTML = element.innerHTML
      element.innerHTML = anchor.outerHTML
    }

    /** highlight code blocks */
    hljs.highlightAll()
  }
  main()
}

async function selectTemplateView(message) {
  const urlType = parseUrlType(location.href)

  switch (urlType) {
    case 'message':
      if (isPost(message)) return postTemplate
      else return messageTemplate

    case 'feed':
      return feedTemplate

    case 'blob':
      return messageTemplate

    default:
      return messageTemplate
  }
}
