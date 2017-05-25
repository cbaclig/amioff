import Exponent from 'exponent';
import React from 'react';
import moment from 'moment';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  ToolbarAndroid,
  DatePickerAndroid,
  TouchableNativeFeedback,
  Text,
  ListView,
} from 'react-native';
import {
  people,
  schedule,
} from './data.json';
import EventRow from './components/eventRow';

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
    backgroundColor: '#e9eaed',
    height: 56,
  },
});


class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this._openDateSelector = this._openDateSelector.bind(this);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const date = new Date();

    this.state = {
      appIsReady: false,
      people,
      schedule,
      date,
      dataSource: ds.cloneWithRows(schedule[moment(date).format('YYYY-MM-DD')]),
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
        date: this.state.date,
      });

      if (action !== DatePickerAndroid.dismissedAction) {
        const date = new Date(year, month, day);
        this.setState({
          date,
          dataSource: this.state.dataSource.cloneWithRows(schedule[moment(date).format('YYYY-MM-DD')]),
        });
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}

          <ToolbarAndroid
            style={styles.toolbar}
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
            renderRow={rowData => (
              <EventRow
                eventName={rowData.eventName}
                person={this.state.people[rowData.personId]}
              />
            )}
          />

          {/*
          <NavigationProvider router={Router}>
            <StackNavigation id="root" initialRoute={Router.getRoute('rootNavigation')} />
          </NavigationProvider>
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
