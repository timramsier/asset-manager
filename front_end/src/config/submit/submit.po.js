import api from '../../js/api'

export default (component) => {
  return new Promise((resolve, reject) => {
    let data = {}
    let { structure } = component.props.form
    structure = structure.concat([{key: 'newAssets'}, {key: 'removeAssets'}, {key: '_id'}, {key: '_shortId'}])
    structure.map(entry => {
      if (entry.type === 'keyvalue') {
        data[entry.key] = component.state.form.data[entry.key].map(keyvalue => {
          let { key, value } = keyvalue
          return { key, value }
        })
      } else {
        if (entry.transformValue && entry.transformValue instanceof Function) {
          data[entry.key] = entry.transformValue(component.state.form.data[entry.key])
        } else {
          data[entry.key] = component.state.form.data[entry.key]
        }
      }
    })
    let firstFn
    if (component.state.method === 'post') {
      firstFn = () => api.addPO(data.poNumber, data.bu)
    } else {
      firstFn = () => Promise.resolve(data)
    }
    firstFn()
    .then((result) => {
      let newAssets = data.newAssets || []
      delete data['newAssets']
      let removeAssets = data.removeAssets || []
      delete data['removeAssets']
      let promArray = []
      newAssets.map(asset => {
        const data = {
          _parent: asset._parent._id,
          po: result._id,
          sn: asset.sn,
          status: 'new'
        }
        promArray.push(new Promise((resolve, reject) => {
          api.addAsset(data)
          .then(value => { resolve(value) })
          .catch(err => reject(err))
        }))
      })
      removeAssets.map(shortId => {
        api._send('put', `assets/all/${shortId}`, { po: null })
      })
      Promise.all(promArray)
      .then(values => {
        let po = result
        po.assets = po.assets.concat(values.map(i => i._id)).filter(i => !i.startsWith('new_'))
        api._send('put', `pos/all/${result._shortId}`, po)
        .then(response => resolve(response))
      })
    })
    .catch((err) => reject(err))
  })
}
