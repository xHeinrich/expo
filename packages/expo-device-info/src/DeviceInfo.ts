import ExpoDeviceInfo from './ExpoDeviceInfo';

export { default as ExpoDeviceInfoView } from './ExpoDeviceInfoView';

export async function getBatteryLevelAsync(): Promise<number> {
  return await ExpoDeviceInfo.getBatteryLevelAsync();
}