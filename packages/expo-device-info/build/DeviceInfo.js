import ExpoDeviceInfo from './ExpoDeviceInfo';
export { default as ExpoDeviceInfoView } from './ExpoDeviceInfoView';
export async function getBatteryLevelAsync() {
    return await ExpoDeviceInfo.getBatteryLevelAsync();
}
//# sourceMappingURL=DeviceInfo.js.map