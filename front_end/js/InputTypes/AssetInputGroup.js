import React from 'react'
import { VelocityTransitionGroup } from 'velocity-react'
import api from '../api'
import AssetInput from './AssetInput'

const { shape, string, func, array, oneOfType } = React.PropTypes

const AssetInputGroup = React.createClass({
  propTypes: {
    handleChange: func,
    pushNewKeyValueEntry: func,
    removeKeyValueEntry: func,
    structure: shape({
      label: string,
      key: string,
      type: string,
      placeholder: string,
      description: string
    }),
    value: oneOfType([array, string]),
    handleKeyValueChange: func,
    setValidationState: func,
    addValidationError: func,
    removeValidationError: func,
    resetArray: func,
    addFormArray: func,
    removeFormArray: func,
    setSaveState: func
  },
  getInitialState () {
    return ({
      options: {
        categories: []
      },
      assets: []
    })
  },
  updateOptions (options) {
    let newState = this.state
    Object.assign(newState.options, options)
    this.setState(newState)
  },
  updateScrollHeight () {
    const scrollHeight = document.getElementsByClassName('asset-input-group-scroll')[0].getBoundingClientRect().height
    console.log(scrollHeight)
    let newState = this.state
    Object.assign(newState, { scrollHeight })
    this.setState(newState)
  },
  pushNewAsset (asset) {
    let newState = this.state
    let assets = newState.assets
    assets.push(asset)
    Object.assign(newState, { assets })
    this.setState(newState)
  },
  componentWillMount () {
    api.getCategories().then((categories) => {
      let options = categories.map(i => i.name)
      this.updateOptions({ categories: options })
    })
    if (this.props.value) {
      this.props.value.forEach(value => {
        api._get('assets', { _id: value })
        .then((asset) => {
          this.pushNewAsset(asset[0])
        })
      })
    }
  },
  render () {
    const assets = this.state.assets || []
    let style
    if (this.state.height >= 520) {
      style = {
        boxShadow: 'inset 0px 0px 5px 0px rgba(125,125,125,1)'
      }
    }
    return (
      <div className='asset-input-group'>
        <div className='asset-input-group-scroll' style={style}>
          <VelocityTransitionGroup enter={{animation: 'slideDown'}} leave={{animation: 'slideUp'}}>
            {assets.map((asset) => {
              return (
                <AssetInput
                  key={`key_${asset._id}`}
                  options={this.state.options}
                  asset={asset}
                  updateScrollHeight={this.updateScrollHeight}
                />
              )
            })}
          </VelocityTransitionGroup>
        </div>
        <AssetInput
          options={this.state.options}
          updateScrollHeight={this.updateScrollHeight}
          newInput
        />
      </div>
    )
  }
})

export default AssetInputGroup
