import * as React from 'react';
import { requireNativeViewManager } from 'expo-modules-core';

const NativeView: React.ComponentType =
  requireNativeViewManager('ExpoKlarnaAuth');

export default function ExpoKlarnaAuthView() {
  return <NativeView />;
}
