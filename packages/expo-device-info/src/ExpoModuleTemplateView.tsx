import * as React from 'react';

import { requireNativeViewManager } from '@unimodules/core';

export default class ExpoDeviceInfoView extends React.Component {
  static NativeView = requireNativeViewManager('ExpoDeviceInfoView');

  render() {
    return (
      <ExpoDeviceInfoView.NativeView />
    );
  }
}
