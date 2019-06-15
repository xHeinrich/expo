import ExpoDevice from './ExpoDevice';

import { PowerState, isPinOrFingerprintSetCallback } from './Device.types';

export { default as ExpoDeviceInfoView } from './ExpoDeviceView';

export const brand = ExpoDevice.brand;
export const freeDiskStorage = ExpoDevice.freeDiskStorage;
export const carrier = ExpoDevice.carrier;
export const manufacturer = ExpoDevice.manufacturer;
export const model = ExpoDevice.model;
export const phoneNumber = ExpoDevice.phoneNumber;
export const serialNumber = ExpoDevice.serialNumber;
export const systemName = ExpoDevice.systemName;
export const totalMemory = ExpoDevice.totalMemory;
export const uniqueId = ExpoDevice.uniqueId;
export const userAgent = ExpoDevice.userAgent;
export const isEmulator = ExpoDevice.isEmulator;
export const isTablet = ExpoDevice.isTablet;
export const hasNotch = ExpoDevice.hasNotch;
export const deviceType = ExpoDevice.deviceType;
export const supportedABIs = ExpoDevice.supportedABIs;

export async function getBatteryLevelAsync(): Promise<number> {
  return await ExpoDevice.getBatteryLevelAsync();
}

export async function getIPAddressAsync(): Promise<string> {
  return await ExpoDevice.getIPAddressAsync();
}

export async function getMACAddressAsync(): Promise<string> {
  return await ExpoDevice.getMACAddressAsync();
}

export async function getPowerStateAsync(): Promise<PowerState> {
  return await ExpoDevice.getPowerStateAsync();
}

export async function isBatteryChargingAsync(): Promise<boolean> {
  return await ExpoDevice.isBatteryChargingAsync();
}

export async function isAirplaneModeAsync(): Promise<boolean> {
  return await ExpoDevice.isAirplaneModeAsync();
}

export function isPinOrFingerprintSet(): isPinOrFingerprintSetCallback {
  return ExpoDevice.isPinOrFingerprintSet();
}

export async function hasSystemFeatureAsync(feature: string): Promise<boolean> {
  return await ExpoDevice.hasSystemFeatureAsync(feature);
}
