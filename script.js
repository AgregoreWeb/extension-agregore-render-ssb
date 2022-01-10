const markdown = require('ssb-markdown')
const { looksLikeLegacySSB, convertLegacySSB } = require('ssb-fetch')
const { isSSBURI } = require('ssb-uri2')

/* global location */
if (document.contentType.includes('application/json') && location.protocol === 'ssb:') {
  console.log('extension-agregore-render-ssb-posts init')

  try {
    const json = document.querySelector('pre').innerText
    const message = JSON.parse(json)
    if (!isPost(message)) {
      throw new Error(
        `missing renderer for message type: ${message?.value?.content?.type}`
      )
    }

    const text = getMarkdown(message)
    if (!text) throw new Error('ssb message type=post is missing text property')

    /**
     * what to do with hashtags?
     * I believe they don't have a canonical uri??
     * so, best to leave to app devs?
     *
     * would be good to show channel messages though...
     * but don't wish to make a non-standard url...
     *
     * agregore currently appends the #music href as expected:
     * ssb://message/sha256/xyz===#music
     *
     * it should probably be a route though:
     * ssb://message/sha256/xyz===/#music
     * but this is smelling. there are opinions required here when
     * we're "only" trying to render rather than build a viewer / app
     *
     * note though, that channels aren't a protocol thing,
     * they're a patchwork construct that is ubiquitous in the ecosysem
     * todo: research what the ecosystem is doing
     *
     * todo: emoji are rendering fine on my machine, no need to render as markup atm
     * todo: investigate if they will render fine on all platforms
     * emoji: emojiAsMarkup => renderEmoji(emojiAsMarkup)
     *
     * todo: does this method even fire? I recall from using it previously that it didn't
     * todo: find out why we have it when toUrl already does the required job!
     * imageLink: ref => renderImageRef(ref),
     * */
    const options = {
      toUrl: (ref) => renderUrlRef(ref),
      imageLink: (ref) => ref,
      emoji: (emojiAsMarkup) => emojiAsMarkup
    }

    function renderUrlRef (ref) {
      console.log('url ref', ref)
      if (looksLikeLegacySSB(ref)) return convertLegacySSB(ref)
      if (ref.startsWith('@')) return convertAtMention(ref, message)
      if (isSSBURI(ref)) return ref
      return ref
    }

    /**
     * https://github.com/ssbc/ssb-markdown#mdinline-source-opts
     * this is supposed to render one line of text, but it's giving the whole text instead
     * todo: check issues for ssb-markdown / raise bug
     */
    const title = markdown.inline(text, options)
    console.log('title', title)

    const rendered = markdown.block(text, options)

    document.write(`
  <!DOCTYPE html>
  <title>${title}</title>
  <meta charset="utf-8"/>
  <meta http-equiv="Content-Type" content="text/html charset=utf-8"/>
  <link rel="stylesheet" href="agregore://theme/style.css"/>
  <link rel="stylesheet" href="agregore://theme/highlight.css"/>
  ${rendered}
  <pre>${JSON.stringify(message, null, 2)}</pre>
  <script src="agregore://theme/highlight.js"></script>
  <script>
    if(window.hljs) hljs.initHighlightingOnLoad()

    const toAnchor = document.querySelectorAll('h1[id],h2[id],h3[id],h4[id]')
    console.log('Anchoring', toAnchor)
  
    for(let element of toAnchor) {
      const anchor = document.createElement('a')
      anchor.setAttribute('href', '#' + element.id)
      anchor.setAttribute('class', 'agregore-header-anchor')
      anchor.innerHTML = element.innerHTML
      element.innerHTML = anchor.outerHTML
    }
  </script>`)
  } catch (error) {
    // todo: tell user maybe? currently just dumps json - that will render soon with json extension
    // todo: could tell user they can search for suitable extensions? and give a list?
    console.warn(
      `extension-agregore-render-ssb-posts: Error rendering ssb content ${error}`
    )
  }
}

function isPost (message) {
  return (
    message?.value?.content?.type === 'post' && !!message?.value?.content?.text
  )
}

function getMarkdown (message) {
  return message?.value?.content?.text || false
}

function convertAtMention (ref, message) {
  const mentions = message?.value?.content?.mentions
  if (!mentions) return ''
  const name = ref.slice(1)
  const link = mentions.reduce((filtered, mention) => {
    if (name === mention.name) filtered.id = mention.link
    return filtered
  }, { id: null })
  if (!link.id) return ''
  return convertLegacySSB(link.id)
}
