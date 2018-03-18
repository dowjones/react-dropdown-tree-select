import marked from 'marked'
import React from 'react'

import HOCReadme from '../../HOC.md'
import 'github-markdown-css/github-markdown.css'
import './utils/prism.js'

export default class HOCStory extends React.Component {
  render () {
    return (
      <div style={{ padding: '10px' }}>
        <span
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: marked(HOCReadme) }}
        />
      </div>
    )
  }
  componentDidMount () {
    global.Prism && global.Prism.highlightAll()
  }
}
