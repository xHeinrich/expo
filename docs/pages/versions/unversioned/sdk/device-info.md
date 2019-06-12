---
title: DeviceInfo
---

Provide information of devices on the application.

![Portrait orientation in different physical orientations](/static/images/screen-orientation-portrait.png)

This API allows changing supported screen orientations at runtime. This will take priority over the `orientation` key in `app.json`.

On both iOS and Android platforms, changes to the screen orientation will override any system settings or user preferences. On Android, it is possible to change the screen orientation while taking the user's preferred orientation into account. On iOS, user and system settings are not accessible by the application and any changes to the screen orientation will override existing settings.

## Installation 

This API is pre-installed in [managed](../../introduction/managed-vs-bare/#managed-workflow) apps. It is not yet available for [bare](../../introduction/managed-vs-bare/#bare-workflow) React Native apps.

## API (TODO)

```js
import { DeviceInfo } from 'expo';
```

### Constants

#### `DeviceInfo.brand: string`

Gets the device brand.

#### `DeviceInfo.carrier: string`

Gets the carrier name (network operator).

#### `DeviceInfo.getManufacturer: string`

Gets the device manufacturer.

#### `DeviceInfo.getModel: string`

Gets the device model.

#### `DeviceInfo.getPhoneNumber: string`

Gets the device phone number.

#### `DeviceInfo.getSerialNumber: string`

Gets the device serial number.

#### `DeviceInfo.getSystemName: string`

Gets the device OS name.

#### `DeviceInfo.getDeviceId: string`

Gets the device ID.


### Methods

- [`DeviceInfo.getTotalDiskCapacity()`](#screenorientationallowasyncorientationlock)
- [`DeviceInfo.getTotalMemory()`](#screenorientationlockasyncorientationlock)
- [`DeviceInfo.getUniqueId()`](#screenorientationlockplatformasyncplatforminfo)
- [`DeviceInfo.getUserAgent()`](#screenorientationunlockasync)
- [`DeviceInfo.isAirPlaneMode()`](#screenorientationgetorientationasync)
- [`DeviceInfo.isBatteryCharging()`](#screenorientationgetorientationlockasync)
- [`DeviceInfo.isEmulator()`](#screenorientationgetplatformorientationlockasync)
- [`DeviceInfo.isPinOrFingerprintSet()`](#screenorientationsupportsorientationlockasyncorientationlock)
- [`DeviceInfo.isTablet()`](#screenorientationremoveorientationchangelisteners)
- [`DeviceInfo.hasNotch()`](#screenorientationremoveorientationchangelistenersubscription)
- [`DeviceInfo.getDeviceType()`](#screenorientationremoveorientationchangelistenersubscription)
- [`DeviceInfo.supportedABIs()`](#screenorientationremoveorientationchangelistenersubscription)
- [`DeviceInfo.hasSystemFeature(feature)`](#screenorientationremoveorientationchangelistenersubscription)
- [`DeviceInfo.getBatteryLevelAsync()`](#screenorientationallowasyncorientationlock)
- [`DeviceInfo.getFreeDiskStoragekAsync()`](#screenorientationgetorientationlockasync)
- [`DeviceInfo.getIPAddressAsync()`](#screenorientationgetplatformorientationlockasync)
- [`DeviceInfo.getMACAddressAsync()`](#screenorientationlockplatformasyncplatforminfo)
- [`DeviceInfo.getPowerStateAsync()`](#screenorientationgetplatformorientationlockasync)

### Enum Types

- [`DeviceInfo.Orientation`](#screenorientationorientation)
- [`DeviceInfo.OrientationLock`](#screenorientationorientationlock)
- [`DeviceInfo.SizeClassIOS`](#screenorientationsizeclassios)
- [`DeviceInfo.WebOrientationLock`](#screenorientationweborientationlock)

### Object Types

- [`DeviceInfo.PlatformOrientationInfo`](#screenorientationplatformorientationinfo)
- [`DeviceInfo.OrientationInfo`](#screenorientationorientationinfo)
- [`DeviceInfo.OrientationChangeEvent`](#screenorientationorientationchangeevent)
- [`Subscription`](#subscription)

### Function Types

- [`DeviceInfo.OrientationChangeListener`](#screenorientationorientationchangelistener)

### Errors

- [Error Codes](#error-codes)

## Constants

This API is mostly synchronous and driven by constants. 

### `Localization.locale: string`

Native device language, returned in standard format. Ex: `en`, `en-US`, `es-US`.

### `Localization.locales: Array<string>`

List of all the native languages provided by the user settings. These are returned in the order the user defines in their native settings.

### `Localization.country: ?string`

Country code for your device.

## Methods

### `DeviceInfo.getBatteryLevelAsync()`

Get the battery level of the device as a float between 0 and 1.

#### Returns

A Promise that resolves to a float representing the battery level.

### `DeviceInfo.getFreeDiskStoragekAsync()`

Gets available storage size, in bytes.

#### Returns

A Promise that resolves to an integer of bytes available in the device's storage.

### `DeviceInfo.getIPAddressAsync()`

Gets the device current IP address.

#### Returns

A Promise that resolves to a string of IP address.

### `DeviceInfo.getMACAddressAsync()`

Gets the network adapter MAC address.

#### Returns

A Promise that resolves to a string of the network adapter MAC address.

### `DeviceInfo.getPowerStateAsync()`

Gets the power state of the device including the battery level, whether it is plugged in, and if the system is currently operating in low power mode. Displays a warning on iOS if battery monitoring not enabled, or if attempted on an emulator (where monitoring is not possible)

#### Returns

Returns a promise with an object with the following fields:

- **batteryLevel (_float_)** -- a float between 0 and 1.

- **batteryState (_string_)** -- `unplugged` if unplugged, `plugged` if plugged.

- **lowPowerMode (_string_)** -- `true` if lowPowerMode is on, `false` if lowPowerMode is off.

### `DeviceInfo.getTotalDiskCapacity()`


#### Arguments

- **orientation (_OrientationLock_)** -- The orientation lock to apply. See the [`OrientationLock`](#screenorientationorientationlock) enum for possible values.

#### Returns

Returns a promise with `void` value, resolving when the orientation is set.

#### Example

```javascript
function changeDeviceInfo() {
  await DeviceInfo.allowAsync(DeviceInfo.Orientation.LANDSCAPE);
}
```

### `DeviceInfo.lockAsync(orientationLock)`

Lock the screen orientation to a particular OrientationLock.

#### Arguments

- **orientationLock (_OrientationLock_)** -- The orientation lock to apply. See the [`OrientationLock`](#screenorientationorientationlock) enum for possible values.

#### Returns

Returns a promise with `void` value, resolving when the orientation is set.

#### Error Codes

- `ERR_SCREEN_ORIENTATION_INVALID_ORIENTATION_LOCK` - an invalid [`OrientationLock`](#screenorientationorientationlock) was passed in.
- `ERR_SCREEN_ORIENTATION_UNSUPPORTED_ORIENTATION_LOCK` - the platform does not support the orientation lock policy.

#### Example

```javascript
async function changeDeviceInfo() {
  await DeviceInfo.lockAsync(DeviceInfo.OrientationLock.LANDSCAPE_LEFT);
}
```

### `DeviceInfo.lockPlatformAsync(platformInfo)`

#### Arguments

- **platformInfo (_PlatformOrientationInfo_)** -- The platform specific lock to apply. See the [`PlatformOrientationInfo`](#screenorientationplatformorientationinfo) object type for the different platform formats.

#### Returns

Returns a promise with `void` value, resolving when the orientation is set and rejecting if an invalid option or value is passed.

#### Error Codes

- `ERR_SCREEN_ORIENTATION_INVALID_ORIENTATION_LOCK` - an invalid [`OrientationLock`](#screenorientationorientationlock) was passed in.
- `ERR_SCREEN_ORIENTATION_UNSUPPORTED_ORIENTATION_LOCK` - the platform does not support the orientation lock policy.

### `DeviceInfo.unlockAsync()`

Sets the screen orientation back to the `OrientationLock.DEFAULT` policy.

#### Returns

Returns a promise with `void` value, resolving when the orientation is set.

### `DeviceInfo.getOrientationAsync()`

Gets the current screen orientation.

#### Returns

Returns a promise that resolves to an [`OrientationInfo`](#screenorientationorientationinfo) object value that reflects the current screen orientation.

### `DeviceInfo.getOrientationLockAsync()`

Gets the current screen orientation lock type.

#### Returns

Returns a promise with an [`OrientationLock`](#screenorientationorientationlock) value.

### `DeviceInfo.getPlatformOrientationLockAsync()`

Gets the platform specific screen orientation lock type.

#### Returns

Returns a promise with a [`PlatformOrientationInfo`](#screenorientationplatformorientationinfo) value.

### `DeviceInfo.supportsOrientationLockAsync(orientationLock)`

Returns whether the [`OrientationLock`](#screenorientationorientationlock) policy is supported on the device.

#### Returns

Returns a promise that resolves to a `boolean` value that reflects whether or not the orientationLock is supported.

### `DeviceInfo.addOrientationChangeListener(listener)`

Invokes the `listener` function when the screen orientation changes.

#### Arguments

- **listener (_OrientationChangeListener_)**
  - Each orientation update will pass an object with the new [`OrientationChangeEvent`](#screenorientationorientationchangeevent) to the listener.

#### Returns

Returns an [`Subscription`](#subscription) object that can later be used to unsuscribe updates to the listener.

### `DeviceInfo.removeOrientationChangeListeners()`

Removes all listeners subscribed to orientation change updates.

### `DeviceInfo.removeOrientationChangeListener(subscription)`

Unsubscribes the listener associated with the `subscription` object from all orientation change updates.

#### Arguments

- **subscription (_Subscription_)**
  - A subscription object that manages the updates passed to a listener function on an orientation change.

## Enum types

### `DeviceInfo.Orientation`

- **`Orientation.UNKNOWN`** - An unknown screen orientation. For example, the device is flat, perhaps on a table.
- **`Orientation.PORTRAIT`** - Portrait interface orientation (right side up or upside down).


### `ScreenOrientation.OrientationLock`

An enum whose values can be passed to the [`lockAsync`](#screenorientationlockasyncorientationlock) method.

- **`OrientationLock.DEFAULT`** -- The default orientation. On iOS, this will allow all orientations except `Orientation.PORTRAIT_DOWN`. On Android, this lets the system decide the best orientation.
- **`OrientationLock.ALL`** -- All four possible orientations
- **`OrientationLock.UNKNOWN`** -- An unknown screen orientation lock. This is not a valid policy that can be applied in [`lockAsync`](#screenorientationlockasyncorientationlock).

### `ScreenOrientation.SizeClassIOS`

Each iOS device has a default set of [size classes](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/TheAdaptiveModel.html) that you can use as a guide when designing your interface.

- **`SizeClassIOS.REGULAR`**
- **`SizeClassIOS.COMPACT`**
- **`SizeClassIOS.UNKNOWN`**

### `ScreenOrientation.WebOrientationLock`

An enum representing the lock policies that can be applied on the web platform, modelled after the [W3C specification](https://w3c.github.io/screen-orientation/#dom-orientationlocktype). These values can be applied through the [`lockPlatformAsync`](#screenorientationlockplatformasyncplatforminfo) method.

- **`PORTRAIT_PRIMARY`**
- **`PORTRAIT_SECONDARY`**

## Object Types

### `ScreenOrientation.PlatformOrientationInfo`

    - screenOrientationConstantAndroid (_integer_): A constant to set using the Android native [API](https://developer.android.com/reference/android/R.attr.html#screenOrientation). For example, in order to set the lock policy to [unspecified](https://developer.android.com/reference/android/content/pm/ActivityInfo.html#SCREEN_ORIENTATION_UNSPECIFIED), -1 should be passed in. (Android only)
    - screenOrientationArrayIOS (Array[Orientation]): An array of orientations to allow on the iOS platform (iOS only)
    - screenOrientationLockWebOrientation (_WebOrientationLock_): A web orientation lock to apply in the browser (web only)

### `ScreenOrientation.OrientationInfo`

    - orientation (_Orientation_): The current orientation of the device
    - verticalSizeClass (_SizeClassIOS_): The [vertical size class](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/TheAdaptiveModel.html) of the device (iOS only)
    - horizontalSizeClass (_SizeClassIOS_): The [horizontal size class](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/TheAdaptiveModel.html) of the device (iOS only)

### `ScreenOrientation.OrientationChangeEvent`

    - orientationLock (_OrientationLock_): The current OrientationLock of the device.
    - orientationInfo (_OrientationInfo_): The current OrientationInfo of the device.

### `Subscription`

A [subscription object](https://github.com/expo/expo/blob/master/packages/expo-react-native-adapter/src/EventEmitter.ts#L16).

## Function Types

### `ScreenOrientation.OrientationChangeListener`

#### Args

    - event (_OrientationChangeEvent_): An update with the most recent OrientationChangeEvent.

#### Returns

`void`

## Error Codes

| Code                                                | Description                                                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| ERR_SCREEN_ORIENTATION_UNSUPPORTED_ORIENTATION_LOCK | The platform does not support the [`OrientationLock`](#screenorientationorientationlock) policy. |
| ERR_SCREEN_ORIENTATION_INVALID_ORIENTATION_LOCK     | An invalid [`OrientationLock`](#screenorientationorientationlock) was passed in.                 |

