---
title: Device
---

Provide information of devices on the application.

## Installation

This API is pre-installed in [managed](../../introduction/managed-vs-bare/#managed-workflow) apps. It is not yet available for [bare](../../introduction/managed-vs-bare/#bare-workflow) React Native apps.

## API

```js
import { Device } from 'expo';
```

### Constants

#### `Device.brand: string`

Gets the device brand.

#### `Device.freeDiskStorage: number`

Gets available storage size, in bytes.

#### `Device.carrier: string`

Gets the carrier name (network operator).

#### `Device.manufacturer: string`

Gets the device manufacturer.

#### `Device.model: string`

Gets the device model.

#### `Device.phoneNumber: string` (Android Only)

Gets the device phone number.

#### `Device.serialNumber: string` (Android Only)

Gets the device serial number.

#### `Device.systemName: string`

Gets the device OS name.

#### `Device.deviceId: string`

Gets the device ID.

#### `Device.totalDiskCapacity: number`

Gets full disk storage size, in bytes.

#### `Device.totalMemory: number`

Gets the device total memory, in bytes.

#### `Device.uniqueId: string`

Gets the device unique ID.

#### `Device.userAgent: string`

Gets the device User Agent.

#### `Device.isTablet: boolean`

Tells if the device is a tablet.

#### `Device.deviceType: string`

Returns the device's type as a string, which will be one of:

- `Handset`
- `Tablet`
- `Tv`
- `Unknown`

#### `Device.supportedABIs: string[]`

Returns a list of supported processor architecture version

**Examples**

```js
Device.supportedABIs; // [ "arm64 v8", "Intel x86-64h Haswell", "arm64-v8a", "armeabi-v7a", "armeabi" ]
```

### Methods

- `Device.hasNotch()`
- `Device.isBatteryChargingAsync()`
- `Device.hasSystemFeatureAsync(feature)` (Android only)
- `Device.getBatteryLevelAsync()`
- `Device.getIPAddressAsync()`
- `Device.getMACAddressAsync()`
- `Device.getPowerStateAsync()` (IOS only)
- `Device.isAirplaneModeAsync()` (Android only)
- `Device.isPinOrFingerprintSet()`

## Methods

### `Device.hasNotch()`

Tells if the device has a notch.

#### Returns

A boolean that represents the support for notch display.

**Examples**

```js
const hasNotch = Device.hasNotch();
```


### `Device.getBatteryLevelAsync()`

Get the battery level of the device as a float between 0 and 1.

#### Returns

A Promise that resolves to a float representing the battery level.

**Examples**

```js
Device.getBatteryLevelAsync().then(batteryLevel => {
  // 0.759999
});
```

### `Device.getIPAddressAsync()`

Gets the device current IP address.

#### Returns

A Promise that resolves to a string of IP address.

**Examples**

```js
Device.getIPAddressAsync().then(ip => {
  // "92.168.32.44"
});
```

### `Device.getMACAddressAsync()`

Gets the network adapter MAC address.

#### Returns

A Promise that resolves to a string of the network adapter MAC address.

**Examples**

```js
Device.getMACAddressAsync().then(mac => {
  // "E5:12:D8:E5:69:97"
});
```

### `Device.getPowerStateAsync()` (IOS only)

Gets the power state of the device including the battery level, whether it is plugged in, and if the system is currently operating in low power mode. Displays a warning on iOS if battery monitoring not enabled, or if attempted on an emulator (where monitoring is not possible)

#### Returns

Returns a promise with an object with the following fields:

- **batteryLevel (_float_)** -- a float between 0 and 1.

- **batteryState (_string_)** -- `unplugged` if unplugged, `plugged` if plugged.

- **lowPowerMode (_string_)** -- `true` if lowPowerMode is on, `false` if lowPowerMode is off.

**Examples**

```js
Device.getPowerStateAsync().then(state => {
  // {
  //   batteryLevel: 0.759999,
  //   batteryState: 'unplugged',
  //   lowPowerMode: false,
  // }
});
```

### `Device.isAirplaneModeAsync()` (Android Only)

Tells if the device is in AirPlaneMode.

#### Returns

Returns a `Promise<boolean>` that resolves to the `boolean` value for whether the device is in airplane mode or not.

**Examples**

```js
Device.isAirPlaneModeAsync().then(airPlaneModeOn => {
  // false
});
```

### `Device.isBatteryChargingAsync()`

Tells if the battery is currently charging.

#### Returns

Returns a `Promise<boolean>` that resolves the `boolean` value for whether the device is charging or not.

**Examples**

```js
Device.isBatteryChargingAsync().then(isCharging => {
  // true or false
});
```

### `Device.hasSystemFeatureAsync(feature)` (Android Only)

Tells if the device has a specific system feature.

#### Arguments

- **feature (_string_)** -- A string of the feature we want to know that the device has.

#### Returns

Returns a `Promise<boolean>` that resolves the `boolean` value for whether the device has the system feature passed to the function.

**Examples**

```js
Device.hasSystemFeatureAsync('amazon.hardware.fire_tv').then(hasFeature => {
  // true or false
});
```

### `Device.isPinOrFingerprintSet()`

Tells if a PIN number or a fingerprint was set for the device.

#### Returns

Returns a `Promise<boolean>` that resolves the `boolean` value for whether the device has set a Pin or Fingerprint.

**Examples**

```js
Device.isPinOrFingerprintSet()(isPinOrFingerprintSet => {
    // true or false
  }
});
```