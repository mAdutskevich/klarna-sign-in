import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/components/useColorScheme";
import { View } from "@/components/Themed";
import { Button } from "react-native";
import {
  EKlarnaEnv,
  EKlarnaMarket,
  EKlarnaRegion,
  EKlarnaLocale,
  klarnaSignIn,
  addKlarnaSignInEventListener,
  type TKlarnaSignInEventListenerPayload,
} from "@/modules/expo-klarna-auth";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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
    const subscription = addKlarnaSignInEventListener(
      (event: TKlarnaSignInEventListenerPayload) => {
        const { message, idToken } = event;

        switch (message) {
          case "KlarnaSignInToken":
          case "klarnaToken":
            // handle the token

            break;
          case "KlarnaSignInAuthorizationFailed": // happens when user presses cross icon in the klarna modal
          case "klarnaSignInUserCancelled": // happens when user presses cancel button in the klarna modal,
            // handle the error

            break;
          default:
            // handle other messages

            break;
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleKlarnaButtonPress = () => {
    const returnUrl = "myapp://login"; // the app's return url, example: "myapp://login", scheme you can get from the app.json, login - is the path you want to redirect to
    const scope = "profile:email profile:phone profile:name"; // the scopes you want to request
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

