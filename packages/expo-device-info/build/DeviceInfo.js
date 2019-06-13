import ExpoDeviceInfo from './ExpoDeviceInfo';
export { default as ExpoDeviceInfoView } from './ExpoDeviceInfoView';
export const brand = ExpoDeviceInfo.brand;
export const freeDiskStorage = ExpoDeviceInfo.freeDiskStorage;
export const carrier = ExpoDeviceInfo.carrier;
export const manufacturer = ExpoDeviceInfo.manufacturer;
export const model = ExpoDeviceInfo.model;
export const phoneNumber = ExpoDeviceInfo.phoneNumber;
export const serialNumber = ExpoDeviceInfo.serialNumber;
export const systemName = ExpoDeviceInfo.systemName;
export async function getBatteryLevelAsync() {
    return await ExpoDeviceInfo.getBatteryLevelAsync();
}
export async function getIPAddressAsync() {
    return await ExpoDeviceInfo.getIPAddressAsync();
}
export async function getMACAddressAsync() {
    return await ExpoDeviceInfo.getMACAddressAsync();
}
export async function getPowerStateAsync() {
    return await ExpoDeviceInfo.getPowerStateAsync();
}
//# sourceMappingURL=DeviceInfo.js.map