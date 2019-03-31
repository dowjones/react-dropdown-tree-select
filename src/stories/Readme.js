import marked from 'marked'
import React from 'react'

import 'github-markdown-css/github-markdown.css'

import './utils/prism'

import Readme from '../../../README.md'

export default class Story extends React.Component {
  componentDidMount() {
    global.Prism && global.Prism.highlightAll()
  }

  render() {
    return (
      <div style={{ padding: '10px' }}>
        <span
          className="markdown-body"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: marked(Readme) }}
        />
      </div>
    )
  }
}
