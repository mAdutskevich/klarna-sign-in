import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Button } from "react-native";
export { ErrorBoundary } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import {
  EKlarnaEnv,
  EKlarnaMarket,
  EKlarnaRegion,
  EKlarnaLocale,
  klarnaSignIn,
  addKlarnaAuthEventListener,
  addKlarnaErrorEventListener,
  addKlarnaOtherEventListener,
  addKlarnaSignInEventListener,
  type TKlarnaSignInEventListenerPayload,
} from "@/modules/expo-klarna-auth";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({});

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const otherEventSubscription = addKlarnaOtherEventListener(
      (event: TKlarnaSignInEventListenerPayload) => {
        console.log("Other event", event);
      }
    );

    const errorEventSubscription = addKlarnaErrorEventListener(
      (event: TKlarnaSignInEventListenerPayload) => {
        console.log("Error event", event);
      }
    );

    const signInEventSubscription = addKlarnaSignInEventListener(
      (event: TKlarnaSignInEventListenerPayload) => {
        console.log("Sign in event", event);
      }
    );

    const authEventSubscription = addKlarnaAuthEventListener(
      (event: TKlarnaSignInEventListenerPayload) => {
        console.log("Auth event", event);
      }
    );

    return () => {
      otherEventSubscription.remove();
      errorEventSubscription.remove();
      signInEventSubscription.remove();
      authEventSubscription.remove();
    };
  }, []);

  const handleKlarnaButtonPress = () => {
    const returnUrl = "myapp://login"; // the app's return url, example: "myapp://login", scheme you can get from the app.json, login - is the path you want to redirect to
    const scope = "profile:email profile:phone profile:name"; // the scopes you want to request, this data will be available in the response idToken. You need to allow it in the Klarna dashboard, otherwise sign in fails
    const clientId = process.env.EXPO_PUBLIC_KLARNA_CLIENT_ID as string; // the client id you got from Klarna

    klarnaSignIn(
      returnUrl,
      clientId,
      scope,
      EKlarnaMarket.SE,
      EKlarnaEnv.PLAYGROUND,
      EKlarnaRegion.EU,
      EKlarnaLocale.EN
    );
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button onPress={handleKlarnaButtonPress} title="Open Klarna Auth" />
      </View>
    </ThemeProvider>
  );
}

