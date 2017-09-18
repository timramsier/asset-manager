import { findDOMNode } from 'react-dom';

const setGridProps = (component, overrideMountCheck = false) => {
  if (component._isMounted || overrideMountCheck) {
    const _setWidth = width => {
      const newState = component.state;
      Object.assign(newState, { cssProps: { width } });
      component.setState(newState);
    };
    const parentWidth = findDOMNode(
      component
    ).parentNode.getBoundingClientRect().width;
    if (parentWidth <= 576) _setWidth('100%');
    else if (parentWidth <= 768 && parentWidth > 576) _setWidth('49.9%');
    else if (parentWidth <= 992 && parentWidth > 768) _setWidth('33.23%');
    else if (parentWidth <= 1200 && parentWidth > 992) _setWidth('24.9%');
    else if (parentWidth >= 1200) _setWidth('24.9%');
  }
};

const guid = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};
const compareArrays = (ref, diff) => {
  if (ref instanceof Array && diff instanceof Array) {
    return ref.filter(i => diff.indexOf(i) < 0);
  }
  return [];
};

const all = {
  setGridProps,
  guid,
  compareArrays,
};

export { all as default, setGridProps, guid, compareArrays };
