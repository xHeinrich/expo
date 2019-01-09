import React from 'react';
import {
  FlatList,
  TouchableHighlight,
  Alert,
  Animated,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  Platform,
  StyleSheet,
  View,
  Switch,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import * as Bluetooth from 'expo-bluetooth';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import MonoText from '../components/MonoText';
import Button from '../components/Button';

/*
 * Mango:
 *
 * - Mounting this screen should start scanning for devices right away.
 *   - This should collect all of the available bluetooth devices.
 *   - This should filter out various bluetooth devices that aren't helpful. TODO: Bacon: (No name?)
 *   - Devices should be sorted by discovery time to prevent jumping around.
 * - Display them in a SectionList with one section dedicated to connected devices, and the other for every other device
 * - Each device should have a button to view more info.
 *   - The more info screen should contain a button to disconnect if connected.
 *   - A button to (Forget This Device). Is this possible?
 *   - The ability to rewrite data - example airpods allow for a name change
 *   - A list of known functionality.
 *   - TODO: Bacon: Add more info
 *
 * - If I tap a non-connected device I should be able to attempt a connection.
 *   - If the connection fails (or times-out?) there should be an alert: "Connection Unsuccessful" "Make sure 'name of device' is turned on and in range." "OK"
 * - When a device is connecting it should have an indicator next to it.
 * - Is it possible to get a list of known devices like in the iOS bluetooth settings?
 * - There should be an indicator at the bottom of the list which shows that scanning is in progress
 * - Is it possible to show the discoverable name of the current device (ios settings)
 *
 * - There should be a toast that presents non-intrusive errors like a device disconnecting from us.
 * - There should be an alert for larger errors.
 *
 * - There should be a section dedicated to the manager.
 *   - This section will display the state of the manager.
 *   - There should be a toggle for scanning.
 *   - If possible (on iOS) we should link to Bluetooth in settings.
 *   - On Android we should be able to turn on/off bluetooth
 *
 * Extra:
 * - Observe when a device disconnects
 * - Search by name
 *
 * Another Use Case:
 * - Get parked car:
 *   - This has nothing to do with bluetooth, create an example and document this to cut down on questions.
 *
 * TODO: Bacon: Change | to _ in uuids
 */

/*
 * Use-case: I just want to scan for peripherals, I'll update my UI from within the view.
 *

Bluetooth.startScanAsync({}, ({ peripheral }) => {

  // Update the view state
  this.setState(({ peripherals }) => {
    const { [peripheral.id]: currentPeripheral = {}, ...others } = peripherals;
    return {
      peripherals: {
        ...others,
        [peripheral.id]: peripheral
      },
    };
  });

});

*/

export default class BluetoothScreen extends React.Component {
  static navigationOptions = {
    title: 'Bluetooth',
  };

  state = {
    center: {},
    peripherals: {},
    isScanning: false,
    centralState: 'unknown',
  };

  async componentDidMount() {
    this.stateListener = Bluetooth.observeStateAsync(state => {
      console.log('observeStateAsync', state);
      this.setState({ centralState: state });
    });
    Bluetooth.observeUpdatesAsync(({ peripherals, error }) => {
      if (error) {
        console.log({ error });
        throw new Error('Bluetooth Screen: observer: ' + error.message);
      }

      this.setState(({ peripherals: currentPeripherals }) => {
        return {
          peripherals: {
            ...currentPeripherals,
            ...peripherals,
          },
        };
      });
    });

    const central = await Bluetooth.getCentralAsync();
    console.log({ central });

    // // Load in one or more peripherals
    // this.setState({ isScanning: true }, () => {
    //   Bluetooth.startScanAsync({}, ({ peripheral }) => {
    //     // this.updatePeripheral(peripheral);
    //     Bluetooth.stopScanAsync();
    //     this.setState({ isScanning: false });
    //   });
    // });
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener.remove();
    }
    if (this.stateListener) this.stateListener.remove();
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  onPressInfo = peripheral => {
    this.props.navigation.push('BluetoothInfoScreen', { peripheral });
  };

  render() {
    const { centralState, peripherals, isScanning } = this.state;
    const data = Object.values(peripherals)
      .filter(({ name }) => name != null)
      .sort((a, b) => a.discoveryTimestamp > b.discoveryTimestamp);

    const canUseBluetooth = centralState === 'poweredOn';
    const message = canUseBluetooth
      ? "Now discoverable as a name that Apple probably doesn't surface... Maybe \"Evan's iPhone?\""
      : `Central is in the ${centralState} state. Please power it on`;
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ marginTop: 26 }}>
            <ScanningItem
              isDisabled={!canUseBluetooth}
              value={isScanning}
              onValueChange={value => {
                this.setState({ isScanning: value });
                if (value) {
                  Bluetooth.startScanAsync();
                } else {
                  Bluetooth.stopScanAsync();
                }
              }}
            />
            <Text style={{ marginLeft: 16, marginVertical: 8, fontSize: 14, opacity: 0.6 }}>
              {message}
            </Text>
          </View>
          {data.length > 0 && (
            <View style={{ marginTop: 26 }}>
              <Text style={{ marginLeft: 16, marginVertical: 8, fontSize: 16, opacity: 0.6 }}>
                DEVICES
              </Text>
              <PeripheralsList onPressInfo={this.onPressInfo} data={data} />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

class PeripheralsList extends React.Component {
  renderItem = ({ item }) => <Item onPressInfo={this.props.onPressInfo} item={item} />;

  renderSectionHeader = ({ section: { title } }) => <Header title={title} />;

  keyExtractor = (item = {}, index) => `key-${item.id || index}`;

  render() {
    return (
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={[
              { height: StyleSheet.hairlineWidth, backgroundColor: '#C7C7C9', marginLeft: 16 },
            ]}
          />
        )}
        data={this.props.data}
        style={styles.list}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        ListFooterComponent={CannyFooter}
      />
    );
  }
}

function CannyFooter() {
  return <View />;
}

class Item extends React.Component {
  state = {
    isConnecting: false,
  };
  onPress = async () => {
    const { item = {} } = this.props;

    if (item.state === 'disconnected') {
      this.setState({ isConnecting: true });
      try {
        const peripheralUUID = item.uuid;
        await Bluetooth.connectAsync({ uuid: peripheralUUID, timeout: 5000 });
        const loadedPeripheral = await Bluetooth.loadPeripheralAsync({
          id: peripheralUUID,
        });
        console.log({ loadedPeripheral });
      } catch (error) {
        Alert.alert('Connection Unsuccessful', `Make sure "${item.name}" is turned on and in range.`)
        console.log(error);
        // console.error(error);
        // alert('Failed: ' + message);
      } finally {
        this.setState({ isConnecting: false });
      }
    } else if (item.state === 'connected') {
      await Bluetooth.disconnectAsync({ uuid: item.id });
    }
  };

  onPressInfo = () => {
    this.props.onPressInfo(this.props.item);
  };

  getSubtitle = () => {
    if (this.state.isConnecting) {
      return <ActivityIndicator animating />;
    }
    return (
      <Text style={[styles.itemText, { fontSize: 18, opacity: 0.6 }]}>{this.props.item.state}</Text>
    );
  };
  render() {
    const { item = {} } = this.props;
    return (
      <ItemContainer disabled={this.state.isConnecting} onPress={this.onPress}>
        <Text style={styles.itemText}>{item.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {this.getSubtitle()}
          <TouchableOpacity style={{ marginLeft: 8 }} onPress={this.onPressInfo}>
            <Ionicons name={'ios-information-circle-outline'} color="#197AFA" size={28} />
          </TouchableOpacity>
        </View>
      </ItemContainer>
    );
  }
}

class ScanningItem extends React.Component {
  render() {
    const { isDisabled } = this.props;
    const title = isDisabled ? 'Bluetooth Scanning is Disabled' : 'Bluetooth Scanning';
    return (
      <ItemContainer
        containerStyle={{ opacity: isDisabled ? 0.8 : 1 }}
        pointerEvents={isDisabled ? 'none' : undefined}>
        <Text style={styles.itemText}>{title}</Text>
        <Switch
          disabled={isDisabled}
          value={this.props.value}
          onValueChange={this.props.onValueChange}
        />
      </ItemContainer>
    );
  }
}

const ItemContainer = ({ children, pointerEvents, containerStyle, style, ...props }) => (
  <TouchableHighlight
    {...props}
    underlayColor={Colors.listItemTouchableHighlight}
    style={[{ backgroundColor: 'white' }, style]}>
    <View pointerEvents={pointerEvents} style={[styles.itemContainer, containerStyle]}>
      {children}
    </View>
  </TouchableHighlight>
);

class Header extends React.Component {
  render() {
    const { title } = this.props;
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{title.toUpperCase()}</Text>
      </View>
    );
  }
}

export class BluetoothInfoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('peripheral').name,
  });

  render() {
    const peripheral = this.props.navigation.getParam('peripheral');
    return (
      <View style={styles.container}>
        <MonoText
          containerStyle={{
            borderWidth: 0,
            flex: 1,
            marginVertical: 8,
            paddingVertical: 18,
            paddingLeft: 12,
          }}>
          {JSON.stringify(peripheral, null, 2)}
        </MonoText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 16,
    flex: 1,
    backgroundColor: '#EFEEF3',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 10,
  },

  itemText: {
    fontSize: 16,
    color: 'black',
  },
  list: {
    flex: 1,
    // paddingHorizontal: 12,
  },
  headerContainer: {
    alignItems: 'stretch',
    borderBottomColor: Colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: Colors.greyBackground,
  },
  headerText: {
    color: Colors.tintColor,
    paddingVertical: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    marginRight: 16,
  },
});