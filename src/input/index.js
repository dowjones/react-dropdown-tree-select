import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Tag from '../tag'
import styles from './index.css'
import { getDataset, debounce } from '../utils'

const cx = cn.bind(styles)

const getTags = (tags = [], onDelete, showAll, numberOfChipsToDisplay) =>
  tags.map((tag, index) => {
    if(numberOfChipsToDisplay && !showAll && index >= numberOfChipsToDisplay){
      return;
    }
    return getTag(tag, onDelete);
  })

const getTag = (tag, onDelete) => {
  const { _id, label, tagClassName, dataset } = tag
  return (
    <li className={cx('tag-item', tagClassName)} key={`tag-item-${_id}`} {...getDataset(dataset)}>
      <Tag label={label} id={_id} onDelete={onDelete} />
    </li>
  )
}

class Input extends PureComponent {
  static propTypes = {
    tags: PropTypes.array,
    placeholderText: PropTypes.string,
    onInputChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onTagRemove: PropTypes.func,
    inputRef: PropTypes.func,
    numberOfChipsToDisplay: PropTypes.number,
    showMore: PropTypes.any,
    showLess: PropTypes.any
  }

  constructor(props) {
    super(props)
    this.state = this.props.numberOfChipsToDisplay ? { showAll: false } : { showAll: true };
    this.delayedCallback = debounce(e => this.props.onInputChange(e.target.value), 300)
  }

  handleInputChange = e => {
    e.persist()
    this.delayedCallback(e)
  }

  toggleVisibleTags = () => {
    this.setState({ showAll: !this.state.showAll })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.numberOfChipsToDisplay && nextProps.tags.length && nextProps.tags.length <= nextProps.numberOfChipsToDisplay) {
      this.setState({ showAll: false });
    }
  }

  render() {
    const { tags, onTagRemove, inputRef, placeholderText = 'Choose...', onFocus, onBlur, numberOfChipsToDisplay, showMore, showLess } = this.props
    let toggleTagsComponent
    if(numberOfChipsToDisplay && tags.length && tags.length > numberOfChipsToDisplay && !this.state.showAll) {
      toggleTagsComponent = <li title='Click to show more' onClick={this.toggleVisibleTags} className='tag-item'>{ showMore || 'More...' }</li>;
    } else if(numberOfChipsToDisplay && tags.length && tags.length > numberOfChipsToDisplay && this.state.showAll) {
      toggleTagsComponent = <li title='Click to show less' onClick={this.toggleVisibleTags} className='tag-item'>{ showLess || 'Less ...' }</li>;
    }

    return (
      <ul className={cx('tag-list')}>
        {getTags(tags, onTagRemove, this.state.showAll, numberOfChipsToDisplay)}
        { toggleTagsComponent }
        <li className={cx('tag-item')}>
          <input
            type="text"
            ref={inputRef}
            className={cx('search')}
            placeholder={placeholderText}
            onChange={this.handleInputChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </li>
      </ul>
    )
  }
}

export default Input
