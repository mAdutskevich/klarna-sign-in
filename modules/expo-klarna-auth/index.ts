import {
  NativeModulesProxy,
  EventEmitter,
  Subscription
} from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoKlarnaAuth.web.ts
// and on native platforms to ExpoKlarnaAuth.ts
import ExpoKlarnaAuthModule from './src/ExpoKlarnaAuthModule';
import ExpoKlarnaAuthView from './src/ExpoKlarnaAuthView';
import {
  type TKlarnaSignInEventListenerPayload,
  EKlarnaEnv,
  EKlarnaRegion,
  EKlarnaLocale,
  EKlarnaMarket
} from './src/ExpoKlarnaAuth.types';

export const klarnaSignIn = (
  returnURL: string,
  clientId: string,
  scope: string,
  market: EKlarnaMarket,
  klarnaEnv: EKlarnaEnv,
  region?: EKlarnaRegion,
  locale?: EKlarnaLocale
) => {
  ExpoKlarnaAuthModule.klarnaSignIn(
    returnURL,
    clientId,
    scope,
    market,
    klarnaEnv,
    region,
    locale
  );
};

const emitter = new EventEmitter(
  ExpoKlarnaAuthModule ?? NativeModulesProxy.ExpoKlarnaAuth
);

export function addKlarnaSignInEventListener(
  listener: (event: TKlarnaSignInEventListenerPayload) => void
): Subscription {
  return emitter.addListener<TKlarnaSignInEventListenerPayload>(
    'onChange',
    listener
  );
}

export {
  ExpoKlarnaAuthView,
  type TKlarnaSignInEventListenerPayload,
  EKlarnaEnv,
  EKlarnaRegion,
  EKlarnaLocale,
  EKlarnaMarket
};
