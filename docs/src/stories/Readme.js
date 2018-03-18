import marked from 'marked'
import React from 'react'

import Readme from '../../../README.md'
import 'github-markdown-css/github-markdown.css'
import './utils/prism.js'

export default class Story extends React.Component {
  render () {
    return (
      <div style={{ padding: '10px' }}>
        <span
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: marked(Readme) }}
        />
      </div>
    )
  }
  componentDidMount () {
    global.Prism && global.Prism.highlightAll()
  }
}
