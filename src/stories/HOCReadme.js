import marked from 'marked'
import React from 'react'

import 'github-markdown-css/github-markdown.css'

import './utils/prism'

import HOCReadme from '../../HOC.md'

export default class HOCStory extends React.Component {
  componentDidMount() {
    global.Prism && global.Prism.highlightAll()
  }

  render() {
    return (
      <div style={{ padding: '10px' }}>
        <span
          className="markdown-body"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: marked(HOCReadme) }}
        />
      </div>
    )
  }
}
