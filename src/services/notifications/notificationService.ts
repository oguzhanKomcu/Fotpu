import firebase from '@react-native-firebase/app';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';

export class NotificationService {
  private static isFirebaseInitialized(): boolean {
    try {
      return firebase.apps && firebase.apps.length > 0;
    } catch {
      return false;
    }
  }

  public static async requestUserPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      if (!this.isFirebaseInitialized()) return false;

      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      console.log('[NotificationService] Firebase messaging not available:', error);
      return false;
    }
  }

  public static async getFCMToken(): Promise<string | null> {
    try {
      if (!this.isFirebaseInitialized()) return null;

      const hasPermission = await this.requestUserPermission();
      if (!hasPermission) return null;

      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.log('[NotificationService] FCM Token fetch skipped:', error);
      return null;
    }
  }

  public static registerListeners(
    onNotificationReceived?: (message: FirebaseMessagingTypes.RemoteMessage) => void
  ) {
    try {
      if (!this.isFirebaseInitialized()) {
        return () => {};
      }

      const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
        if (onNotificationReceived) {
          onNotificationReceived(remoteMessage);
        }
      });

      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('[NotificationService] Notification opened from background:', remoteMessage);
      });

      messaging()
        .getInitialNotification()
        .catch(() => {});

      return unsubscribeForeground;
    } catch (error) {
      return () => {};
    }
  }
}
