import { findDOMNode } from 'react-dom'

const setGridProps = (component, overrideMountCheck = false) => {
  if (component._isMounted || overrideMountCheck) {
    const _setWidth = (width) => {
      let newState = component.state
      Object.assign(newState, {cssProps: { width }})
      component.setState(newState)
    }
    let parentWidth = findDOMNode(component)
      .parentNode
      .getBoundingClientRect()
      .width
    if (parentWidth <= 576) _setWidth('100%')
    else if (parentWidth <= 768 && parentWidth > 576) _setWidth('50%')
    else if (parentWidth <= 992 && parentWidth > 768) _setWidth('33.33%')
    else if (parentWidth <= 1200 && parentWidth > 992) _setWidth('25%')
    else if (parentWidth >= 1200) _setWidth('25%')
  }
}

const all = {
  setGridProps
}

export {
 all as default,
  setGridProps
}
