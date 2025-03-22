import '~/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FileText, Home, User } from 'lucide-react-native';
import * as React from 'react';
import { Platform } from 'react-native';
import { ThemeToggle } from '~/components/ThemeToggle';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
   // Catch any errors thrown by the Layout component.
   ErrorBoundary
} from 'expo-router';

import { Redirect } from 'expo-router';
import { useAuth } from '~/lib/useAuth';

export default function RootLayout() {
  const { isAuthenticated, loading } = useAuth();
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(true);

  // Use effect to handle any post-mount operations if needed
  React.useEffect(() => {
    // Any initialization that needs to happen after mount
    setIsColorSchemeLoaded(true);
  }, []);

  // If still loading auth state, show nothing yet
  if (loading) {
    return null;
  }

  // If user is not authenticated, redirect to sign-in
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // We don't need this check anymore since we initialize to true
  // and only use the state for post-mount operations
  // if (!isColorSchemeLoaded) {
  //   return null;
  // }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDarkColorScheme ? NAV_THEME.dark.primary : NAV_THEME.light.primary,
          tabBarInactiveTintColor: isDarkColorScheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
          tabBarStyle: {
            backgroundColor: isDarkColorScheme ? NAV_THEME.dark.card : NAV_THEME.light.card,
            borderTopColor: isDarkColorScheme ? NAV_THEME.dark.border : NAV_THEME.light.border,
          },
          headerRight: () => <ThemeToggle />,
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name='invoice'
          options={{
            title: 'Invoice',
            tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
         <Tabs.Screen
        name="history"
        options={{
          href: null,
        }}
      />
         <Tabs.Screen
        name="invoice/create"
        options={{
          href: null,
        }}
      />
         <Tabs.Screen
        name="invoice/[id]"
        options={{
          href: null,
          title: "Invoice Detail"
        }}
      />
         <Tabs.Screen
        name="objectives-history"
        options={{
          href: null,
          title: "Invoice Detail"
        }}
      />
      </Tabs>
      <PortalHost />
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
