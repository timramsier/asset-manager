import React from 'react';

const { object, func } = React.PropTypes;

const AsyncLoad = React.createClass({
  propTypes: {
    props: object,
    loadingPromise: object,
    loadingView: func,
  },
  getInitialState() {
    return {
      loaded: false,
    };
  },
  componentDidMount() {
    this._isMounted = true;
    this.props.loadingPromise.then(module => {
      this.component = module.default;
      if (this._isMounted) {
        this.setState({ loaded: true });
      }
    });
  },
  componentWillUnmount() {
    this._isMounted = false;
  },
  render() {
    let LoadingView = () => (
      <div className="center">
        <div className="loading">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    );
    if (this.props.loadingView) {
      LoadingView = this.props.loadingView;
    }
    if (this.state.loaded) {
      return <this.component {...this.props.props} />;
    }
    return <LoadingView />;
  },
});

export default AsyncLoad;
