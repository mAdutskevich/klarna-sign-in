export type TKlarnaSignInEventListenerPayload = {
  status: string;
  message: string;
  accessToken: string;
  idToken: string;
  refreshToken: string;
  scope: string;
  tokenType: string;
  expiresIn: number;
};

export type ExpoKlarnaSignInResponse = {
  action: string;
  params: Record<string, string>;
};

export enum EKlarnaEnv {
  DEMO = "DEMO",
  PLAYGROUND = "PLAYGROUND",
  PRODUCTION = "PRODUCTION",
  STAGING = "STAGING",
}

export enum EKlarnaRegion {
  EU = "EU",
  NA = "NA",
  OC = "OC",
}

export enum EKlarnaLocale {
  SE = "sv-SE",
  EN = "en-SE",
}

export enum EKlarnaMarket {
  SE = "SE",
}

