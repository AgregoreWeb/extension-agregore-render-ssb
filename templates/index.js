const { template: postTpl, view: postView } = require('./post')
const { template: feedTpl, view: feedView } = require('./feed')
const { template: messageTpl, view: messageView } = require('./message')

module.exports = {
  post: {
    template: postTpl,
    view: postView
  },
  feed: {
    template: feedTpl,
    view: feedView
  },
  message: {
    template: messageTpl,
    view: messageView
  }
}
