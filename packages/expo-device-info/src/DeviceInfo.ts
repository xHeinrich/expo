import ExpoDeviceInfo from './ExpoDeviceInfo';

import { PowerState } from './DeviceInfo.types';

export { default as ExpoDeviceInfoView } from './ExpoDeviceInfoView';

export const brand = ExpoDeviceInfo.brand;
export const freeDiskStorage = ExpoDeviceInfo.freeDiskStorage;
export const carrier = ExpoDeviceInfo.carrier;
export const manufacturer = ExpoDeviceInfo.manufacturer;
export const model = ExpoDeviceInfo.model;
export const phoneNumber = ExpoDeviceInfo.phoneNumber;
export const serialNumber = ExpoDeviceInfo.serialNumber;
export const systemName = ExpoDeviceInfo.systemName;

export async function getBatteryLevelAsync(): Promise<number> {
  return await ExpoDeviceInfo.getBatteryLevelAsync();
}

export async function getIPAddressAsync(): Promise<string> {
  return await ExpoDeviceInfo.getIPAddressAsync();
}

export async function getMACAddressAsync(): Promise<string> {
  return await ExpoDeviceInfo.getMACAddressAsync();
}

export async function getPowerStateAsync(): Promise<PowerState> {
  return await ExpoDeviceInfo.getPowerStateAsync();
}