import { Platform } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
  PermissionStatus,
  openSettings,
} from 'react-native-permissions';

export class PermissionService {
  private static getCameraPermission(): Permission {
    return Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;
  }

  private static getGalleryPermission(): Permission {
    if (Platform.OS === 'ios') {
      return PERMISSIONS.IOS.PHOTO_LIBRARY;
    }
    // Android 13 (API 33)+ uses READ_MEDIA_IMAGES
    return Number(Platform.Version) >= 33
      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  }

  private static getLocationPermission(): Permission {
    return Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  }

  public static async requestCameraPermission(): Promise<boolean> {
    try {
      const permission = this.getCameraPermission();
      let status = await check(permission);

      if (status === RESULTS.DENIED) {
        status = await request(permission);
      }

      if (status === RESULTS.BLOCKED) {
        openSettings();
        return false;
      }

      return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
    } catch (error) {
      console.error('[PermissionService] Error requesting camera permission:', error);
      return false;
    }
  }

  public static async requestGalleryPermission(): Promise<boolean> {
    try {
      const permission = this.getGalleryPermission();
      let status = await check(permission);

      if (status === RESULTS.DENIED) {
        status = await request(permission);
      }

      if (status === RESULTS.BLOCKED) {
        openSettings();
        return false;
      }

      return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
    } catch (error) {
      console.error('[PermissionService] Error requesting gallery permission:', error);
      return false;
    }
  }

  public static async requestLocationPermission(): Promise<boolean> {
    try {
      const permission = this.getLocationPermission();
      let status = await check(permission);

      if (status === RESULTS.DENIED) {
        status = await request(permission);
      }

      return status === RESULTS.GRANTED;
    } catch (error) {
      console.error('[PermissionService] Error requesting location permission:', error);
      return false;
    }
  }
}
