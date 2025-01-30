import { EventEmitter, type Subscription } from "expo-modules-core";

// Import the native module. On web, it will be resolved to ExpoKlarnaAuth.web.ts
// and on native platforms to ExpoKlarnaAuth.ts
import ExpoKlarnaAuthModule from "./src/ExpoKlarnaAuthModule";
import ExpoKlarnaAuthView from "./src/ExpoKlarnaAuthView";
import {
  type TKlarnaSignInEventListenerPayload,
  EKlarnaEnv,
  EKlarnaRegion,
  EKlarnaLocale,
  EKlarnaMarket,
  EEventType,
} from "./src/ExpoKlarnaAuth.types";

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

const emitter = new EventEmitter(ExpoKlarnaAuthModule);

export function addKlarnaSignInEventListener(
  listener: (event: TKlarnaSignInEventListenerPayload) => void
): Subscription {
  return emitter.addListener<TKlarnaSignInEventListenerPayload>(
    EEventType.SignInEvent,
    listener
  );
}

export function addKlarnaErrorEventListener(
  listener: (event: TKlarnaSignInEventListenerPayload) => void
): Subscription {
  return emitter.addListener<TKlarnaSignInEventListenerPayload>(
    EEventType.ErrorEvent,
    listener
  );
}

export function addKlarnaAuthEventListener(
  listener: (event: TKlarnaSignInEventListenerPayload) => void
): Subscription {
  return emitter.addListener<TKlarnaSignInEventListenerPayload>(
    EEventType.AuthEvent,
    listener
  );
}

export function addKlarnaOtherEventListener(
  listener: (event: TKlarnaSignInEventListenerPayload) => void
): Subscription {
  return emitter.addListener<TKlarnaSignInEventListenerPayload>(
    EEventType.SignInEvent,
    listener
  );
}

export {
  type TKlarnaSignInEventListenerPayload,
  ExpoKlarnaAuthView,
  EKlarnaRegion,
  EKlarnaLocale,
  EKlarnaMarket,
  EKlarnaEnv,
};

