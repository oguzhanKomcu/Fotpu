import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/navigation/RootNavigator';
import { NotificationService } from '@/services/notifications/notificationService';
import '@/theme/global.css';

export const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Safe Initialize Push Notifications (FCM)
    try {
      NotificationService.requestUserPermission();
      NotificationService.getFCMToken();
      const unsubscribeNotifications = NotificationService.registerListeners();

      return () => {
        if (unsubscribeNotifications) {
          try {
            unsubscribeNotifications();
          } catch (e) {
            // ignore cleanup error
          }
        }
      };
    } catch (err) {
      console.log('[App] Notification initialization skipped:', err);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <RootNavigator />
    </SafeAreaProvider>
  );
};

export default App;
