import { NativeModulesProxy } from '@unimodules/core';

const { ExpoDeviceInfo } = NativeModulesProxy;

export { default as ExpoDeviceInfoView } from './ExpoDeviceInfoView';

export async function someGreatMethodAsync(options: any) {
  return await ExpoDeviceInfo.someGreatMethodAsync(options);
}
