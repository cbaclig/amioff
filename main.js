import Exponent from 'exponent';
import React from 'react';
import moment from 'moment';
import {
  StatusBar,
  StyleSheet,
  View,
  ToolbarAndroid,
  DatePickerAndroid,
  TouchableNativeFeedback,
  Text,
  ListView,
} from 'react-native';
// import {
//   NavigationProvider,
//   StackNavigation,
// } from '@exponent/ex-navigation';
import {
  FontAwesome,
} from '@exponent/vector-icons';

// import Router from './navigation/Router';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  toolbar: {
    marginTop: StatusBar.currentHeight, // android Only
    backgroundColor: '#e9eaed',
    height: 56,
  },
});


class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this._openDateSelector = this._openDateSelector.bind(this);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      appIsReady: false,
      dataSource: ds.cloneWithRows([
        'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'Devin',
      ]),
    };
  }

  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [
          require('./assets/images/exponent-wordmark.png'),
        ],
        fonts: [
          FontAwesome.font,
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
        ],
      });
    } catch(e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
        'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }

  async _openDateSelector() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
      });

      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({ date: new Date(year, month, day) });
        this._updateList();
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  _updateList() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows([
        moment(this.state.date).format('Ymd !!!'),
      ]),
    });
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <View style={styles.container}>
          <ToolbarAndroid
            style={styles.toolbar}
            actions={[{ title: 'Settings', show: 'always' }]}
          >
            <TouchableNativeFeedback
              onPress={this._openDateSelector}
              background={TouchableNativeFeedback.SelectableBackground()}
            >
              <View>
                <Text>{moment(this.state.date).format('MMMM Do, YYYY')}</Text>
              </View>
            </TouchableNativeFeedback>
          </ToolbarAndroid>

          <ListView
            dataSource={this.state.dataSource}
            renderRow={rowData => <Text>{rowData} {moment(this.state.date).format('MM D, YY')}</Text>}
          />

          {/*
          <NavigationProvider router={Router}>
            <StackNavigation id="root" initialRoute={Router.getRoute('rootNavigation')} />
          </NavigationProvider>

          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
          */}
        </View>
      );
    }
    return (
      <Exponent.Components.AppLoading />
    );
  }
}

Exponent.registerRootComponent(AppContainer);
