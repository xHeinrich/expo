---
title: DeviceInfo
---

Provide information of devices on the application.

## Installation 

This API is pre-installed in [managed](../../introduction/managed-vs-bare/#managed-workflow) apps. It is not yet available for [bare](../../introduction/managed-vs-bare/#bare-workflow) React Native apps.

## API (TODO)

```js
import { DeviceInfo } from 'expo';
```

### Constants

#### `DeviceInfo.brand: string`

Gets the device brand.

#### `DeviceInfo.freediskstorage: number`

Gets available storage size, in bytes.

#### `DeviceInfo.carrier: string`

Gets the carrier name (network operator).

#### `DeviceInfo.manufacturer: string`

Gets the device manufacturer.

#### `DeviceInfo.model: string`

Gets the device model.

#### `DeviceInfo.phoneNumber: string`

Gets the device phone number.

#### `DeviceInfo.serialNumber: string`

Gets the device serial number.

#### `DeviceInfo.systemName: string`

Gets the device OS name.

#### `DeviceInfo.deviceId: string`

Gets the device ID.

#### `DeviceInfo.totalDiskCapacity: number`

Gets full disk storage size, in bytes.

#### `DeviceInfo.totalMemory: number`

Gets the device total memory, in bytes.

#### `DeviceInfo.uniqueId: string`

Gets the device unique ID.

#### `DeviceInfo.userAgent: string`

Gets the device User Agent.

#### `DeviceInfo.isEmulator: boolean`

Tells if the application is running in an emulator.

#### `DeviceInfo.isTablet: boolean`

Tells if the device is a tablet.

#### `DeviceInfo.hasNotch: boolean`

Tells if the device has a notch.

#### `DeviceInfo.deviceType: string`

Returns the device's type as a string, which will be one of:

- `Handset`
- `Tablet`
- `Tv`
- `Unknown`

#### `DeviceInfo.supportedABIs: string[]`

Returns a list of supported processor architecture version

**Examples**

```js
DeviceInfo.supportedABIs(); // [ "arm64 v8", "Intel x86-64h Haswell", "arm64-v8a", "armeabi-v7a", "armeabi" ]
```

### Methods

- `DeviceInfo.isBatteryChargingAsync()`
- `DeviceInfo.hasSystemFeatureAsync()` (Android only)
- `DeviceInfo.getBatteryLevelAsync()`
- `DeviceInfo.getIPAddressAsync()`
- `DeviceInfo.getMACAddressAsync()`
- `DeviceInfo.getPowerStateAsync()` (IOS only)
- `DeviceInfo.isAirplaneMode()` (Android only)
- `DeviceInfo.isPinOrFingerprintSet()` 

### Errors

- [Error Codes](#error-codes)

## Methods

### `DeviceInfo.getBatteryLevelAsync()`

Get the battery level of the device as a float between 0 and 1.

#### Returns

A Promise that resolves to a float representing the battery level.

**Examples**

```js
DeviceInfo.getBatteryLevelAsync().then(batteryLevel => {
  // 0.759999
});
```

### `DeviceInfo.getIPAddressAsync()`

Gets the device current IP address.

#### Returns

A Promise that resolves to a string of IP address.

**Examples**

```js
DeviceInfo.getIPAddress().then(ip => {
  // "92.168.32.44"
});
```

### `DeviceInfo.getMACAddressAsync()`

Gets the network adapter MAC address.

#### Returns

A Promise that resolves to a string of the network adapter MAC address.

**Examples**

```js
DeviceInfo.getMACAddress().then(mac => {
  // "E5:12:D8:E5:69:97"
});
```

### `DeviceInfo.getPowerStateAsync()` (IOS only)

Gets the power state of the device including the battery level, whether it is plugged in, and if the system is currently operating in low power mode. Displays a warning on iOS if battery monitoring not enabled, or if attempted on an emulator (where monitoring is not possible)

#### Returns

Returns a promise with an object with the following fields:

- **batteryLevel (_float_)** -- a float between 0 and 1.

- **batteryState (_string_)** -- `unplugged` if unplugged, `plugged` if plugged.

- **lowPowerMode (_string_)** -- `true` if lowPowerMode is on, `false` if lowPowerMode is off.


**Examples**

```js
DeviceInfo.getPowerState().then(state => {
  // {
  //   batteryLevel: 0.759999,
  //   batteryState: 'unplugged',
  //   lowPowerMode: false,
  // }
});
```

### `DeviceInfo.isAirplaneModeAsync()` (Android Only)

Tells if the device is in AirPlaneMode.

#### Returns 

Returns a `Promise<boolean>` that resolves to the `boolean` value for whether the device is in airplane mode or not.

**Examples**

```js
DeviceInfo.isAirPlaneModeAsync().then(airPlaneModeOn => {
  // false
});
```

### `DeviceInfo.isBatteryChargingAsync()`

Tells if the battery is currently charging.

#### Returns 

Returns a `Promise<boolean>` that resolves the `boolean` value for whether the device is charging or not.

**Examples**

```js
DeviceInfo.isBatteryChargingAsync().then(isCharging => {
  // true or false
});
```

### `DeviceInfo.hasSystemFeatureAsync(feature)` (Android Only)

Tells if the device has a specific system feature.

#### Arguments

- **feature (_string_)** -- A string of the feature we want to know that the device has.

#### Returns

Returns a `Promise<boolean>` that resolves the `boolean` value for whether the device has the system feature passed to the function.

**Examples**

```js
DeviceInfo.hasSystemFeature('amazon.hardware.fire_tv').then(hasFeature => {
  // true or false
}); 
```

### `DeviceInfo.isPinOrFingerprintSet()`

Tells if a PIN number or a fingerprint was set for the device.

#### Returns 
Returns a `(callback)boolean`.

**Examples**

```js
DeviceInfo.isPinOrFingerprintSet()(isPinOrFingerprintSet => {
  if (!isPinOrFingerprintSet) {
    // ...
  }
});
```


#### Error Codes

- `ERR_SCREEN_ORIENTATION_INVALID_ORIENTATION_LOCK` - an invalid [`OrientationLock`](#screenorientationorientationlock) was passed in.
- `ERR_SCREEN_ORIENTATION_UNSUPPORTED_ORIENTATION_LOCK` - the platform does not support the orientation lock policy.

### `Subscription`

A [subscription object](https://github.com/expo/expo/blob/master/packages/expo-react-native-adapter/src/EventEmitter.ts#L16).

## Error Codes

| Code                                                | Description                                                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| ERR_SCREEN_ORIENTATION_UNSUPPORTED_ORIENTATION_LOCK | The platform does not support the [`OrientationLock`](#screenorientationorientationlock) policy. |
| ERR_SCREEN_ORIENTATION_INVALID_ORIENTATION_LOCK     | An invalid [`OrientationLock`](#screenorientationorientationlock) was passed in.                 |

