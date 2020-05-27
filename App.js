/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';

import { Provider } from 'react-redux';
import configureStore from './src/store/configureStore';

import MainNavigator from './src/navigations/MainNavigator';

console.disableYellowBox = true;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storeCreated: false,
      store: null,
    };
  }

  async componentDidMount() {
    configureStore(() =>
      this.setState({
        storeCreated: false,
      })
    ).then(store =>
      this.setState({
        store,
        storeCreated: true,
      })
    );
  }

  render() {
    const {storeCreated, store} = this.state;
    if (!storeCreated) {
      return null;
    }
    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }
}

export default App;
