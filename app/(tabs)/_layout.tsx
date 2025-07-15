import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName: any;

          switch (route.name) {
            case 'dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'transactions':
              iconName = focused ? 'swap-vertical' : 'swap-vertical-outline';
              break;
            case 'groups':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'reports':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'apps-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: '#00803e',
        tabBarInactiveTintColor: '#888888',
      })}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="transactions" />
      <Tabs.Screen name="groups" />
      <Tabs.Screen name="reports" />
      <Tabs.Screen name="settings" />
      {/* Hide the child route from tabs */}
      <Tabs.Screen
        name="settings/cycleCreation"
        options={{ href: null }}
      />
    </Tabs>
  );
}