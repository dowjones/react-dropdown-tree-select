import React from 'react'
import ReactStory, { defaultProps } from 'react-story'

import CodeSandbox from './CodeSandbox'
import HOCReadme from './stories/HOCReadme'
import Readme from './stories/Readme'
import Simple from './stories/Simple'
import BigData from './stories/BigData'
import Options from './stories/Options'
import DefaultValues from './stories/DefaultValues'

import './stories/utils/prism.css'

const stories = [
  { name: 'Readme', component: Readme },
  { name: 'HOC Readme', component: HOCReadme },

  { name: 'Basic (no extra styles)', component: Simple },
  { name: 'Options', component: Options },
  { name: 'Large Tree', component: BigData },
  { name: 'Default Values', component: DefaultValues },
  { name: 'With Bootstrap Styles', component: CodeSandbox('382pjronm') },
  { name: 'With Material Design Styles', component: CodeSandbox('2o1pv6925p') },
  { name: 'With Country flags', component: CodeSandbox('6w41wlvj8z') },
  { name: 'Simple Select', component: CodeSandbox('5xzn337wjn') },
  {
    name: 'Custom Select/Unselect All Buttons (HOC)',
    component: CodeSandbox('n348v2qox0')
  },
  {
    name: 'Internal Select All Checkbox (HOC)',
    component: CodeSandbox('rjwqq86p1n')
  },
  {
    name: 'Prevent re-render on parent render (HOC)',
    component: CodeSandbox('v05klkn56l')
  },
  { name: 'Tree Node Paths (HOC)', component: CodeSandbox('l765q6lmrq') }
]

const App = () => (
  <ReactStory
    style={{
      display: 'block',
      width: '100%',
      height: '100%'
    }}
    pathPrefix="story/"
    Story={props => (
      <defaultProps.StoryWrapper
        css={{
          padding: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          {...props}
          style={{
            flex: '1 0 auto',
            position: 'relative'
          }}
        />
      </defaultProps.StoryWrapper>
    )}
    stories={stories}
  />
)

export default App
