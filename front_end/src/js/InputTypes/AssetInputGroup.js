import React from 'react'
import { VelocityTransitionGroup } from 'velocity-react'
import { compareArrays, guid } from '../common'
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
    setSaveState: func,
    updateSaveState: func
  },
  getInitialState () {
    return ({
      _id: guid(),
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
  pushNewAsset (asset) {
    let newState = this.state
    let assets = newState.assets
    assets.push(asset)
    Object.assign(newState, { assets })
    this.setState(newState)
  },
  removeAsset (_id) {
    let newState = this.state
    let index = newState.assets.findIndex(i => i._id === _id)
    if (index > -1) {
      newState.assets.splice(index, 1)
      index > -1 && (this.setState(newState))
    }
  },
  componentWillMount () {
    api.getCategories().then((categories) => {
      let options = categories.map(i => i.name)
      this.updateOptions({ categories: options })
    })
  },
  componentWillReceiveProps (nextProps) {
    const assets = this.state.assets.map(i => i._id)
    const values = nextProps.value
    const actions = {
      remove: compareArrays(assets, values),
      add: compareArrays(values, assets)
    }
    if (actions.remove.length > 0) {
      actions.remove.map((_id) => {
        this.removeAsset(_id)
      })
    }
    if (actions.add.length > 0) {
      actions.add.map((_id) => {
        api._get('assets', { _id })
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
                  removeFormArray={this.props.removeFormArray}
                  addFormArray={this.props.addFormArray}
                  pushNewAsset={this.pushNewAsset}
                  updateSaveState={this.props.updateSaveState}
                />
              )
            })}
          </VelocityTransitionGroup>
        </div>
        <AssetInput
          options={this.state.options}
          removeFormArray={this.props.removeFormArray}
          addFormArray={this.props.addFormArray}
          pushNewAsset={this.pushNewAsset}
          updateSaveState={this.props.updateSaveState}
          newInput
        />
      </div>
    )
  }
})

export default AssetInputGroup
