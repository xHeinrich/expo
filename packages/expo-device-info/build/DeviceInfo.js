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
export const totalDiskCapacity = ExpoDeviceInfo.totalDiskCapacity;
export const totalMemory = ExpoDeviceInfo.totalMemory;
export const uniqueId = ExpoDeviceInfo.uniqueId;
export const userAgent = ExpoDeviceInfo.userAgent;
export const isEmulator = ExpoDeviceInfo.isEmulator;
export const isTablet = ExpoDeviceInfo.isTablet;
export const hasNotch = ExpoDeviceInfo.hasNotch;
export const deviceType = ExpoDeviceInfo.deviceType;
export const supportedABIs = ExpoDeviceInfo.supportedABIs;
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
export async function isBatteryChargingAsync() {
    return await ExpoDeviceInfo.isBatteryChargingAsync();
}
export async function isAirplaneModeAsync() {
    return await ExpoDeviceInfo.isAirplaneModeAsync();
}
export function isPinOrFingerprintSet() {
    return ExpoDeviceInfo.isPinOrFingerprintSet();
}
export async function hasSystemFeatureAsync(feature) {
    return await ExpoDeviceInfo.hasSystemFeatureAsync(feature);
}
//# sourceMappingURL=DeviceInfo.js.map