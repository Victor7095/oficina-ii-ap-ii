import "react-native-get-random-values";
import "@ethersproject/shims";
import "node-libs-react-native/globals.js";

import { useEffect } from "react";

import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initFonts } from "./theme/fonts"; // expo
import * as storage from "./utils/storage";
import { IAsyncStorage } from "./AsyncStorage";
import { AppNavigator, canExit } from "./navigators/appNavigator";
import {
  useBackButtonHandler,
  useNavigationPersistence,
} from "./navigators/navigationUtilities";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LogBox } from 'react-native';

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE";

// Ignore log notification by message:
LogBox.ignoreLogs(['The provided value \'ms-stream', 'The provided value \'moz-chunked-arraybuffer']);

export default function App() {
  useBackButtonHandler(canExit);
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY);

  useEffect(() => {
    (async () => {
      await initFonts(); // Configure fonts
    })();
  }, []);

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!isNavigationStateRestored) return null;

  return (
    <WalletConnectProvider
      redirectUrl={`wmw://app`}
      storageOptions={{
        asyncStorage: AsyncStorage as unknown as IAsyncStorage,
      }}
    >
      <SafeAreaProvider>
        <AppNavigator
          initialState={initialNavigationState}
          onStateChange={onNavigationStateChange}
        />
      </SafeAreaProvider>
    </WalletConnectProvider>
  );
}
