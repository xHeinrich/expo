import ExpoDeviceInfo from './ExpoDeviceInfo';

import { PowerState, isPinOrFingerprintSetCallback } from './DeviceInfo.types';

export { default as ExpoDeviceInfoView } from './ExpoDeviceInfoView';

export const brand = ExpoDeviceInfo.brand;
export const freeDiskStorage = ExpoDeviceInfo.freeDiskStorage;
export const carrier = ExpoDeviceInfo.carrier;
export const manufacturer = ExpoDeviceInfo.manufacturer;
export const model = ExpoDeviceInfo.model;
export const phoneNumber = ExpoDeviceInfo.phoneNumber;
export const serialNumber = ExpoDeviceInfo.serialNumber;
export const systemName = ExpoDeviceInfo.systemName;
export const totalMemory = ExpoDeviceInfo.totalMemory;
export const uniqueId = ExpoDeviceInfo.uniqueId;
export const userAgent = ExpoDeviceInfo.userAgent;
export const isEmulator = ExpoDeviceInfo.isEmulator;
export const isTablet = ExpoDeviceInfo.isTablet;
export const hasNotch = ExpoDeviceInfo.hasNotch;
export const deviceType = ExpoDeviceInfo.deviceType;
export const supportedABIs = ExpoDeviceInfo.supportedABIs;

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

export async function isBatteryChargingAsync(): Promise<boolean> {
  return await ExpoDeviceInfo.isBatteryChargingAsync();
}

export async function isAirplaneModeAsync(): Promise<boolean> {
  return await ExpoDeviceInfo.isAirplaneModeAsync();
}

export function isPinOrFingerprintSet(): isPinOrFingerprintSetCallback {
  return ExpoDeviceInfo.isPinOrFingerprintSet();
}

export async function hasSystemFeatureAsync(feature: string): Promise<boolean> {
  return ExpoDeviceInfo.hasSystemFeatureAsync(feature);
}
