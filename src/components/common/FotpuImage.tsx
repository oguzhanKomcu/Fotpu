import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import FastImage, { FastImageProps, Priority } from 'react-native-fast-image';
import { FotpuColors } from '@/theme/colors';

interface FotpuImageProps extends Omit<FastImageProps, 'source'> {
  uri?: string | null;
  priority?: Priority;
  fallbackSource?: number;
  containerClassName?: string;
}

export const FotpuImage: React.FC<FotpuImageProps> = ({
  uri,
  priority = FastImage.priority.normal,
  fallbackSource,
  style,
  containerClassName = '',
  ...rest
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  if (!uri || hasError) {
    return (
      <View
        style={[styles.placeholder, style]}
        className={`bg-gray-200 dark:bg-zinc-800 items-center justify-center ${containerClassName}`}
      />
    );
  }

  return (
    <View style={[styles.container, style]} className={containerClassName}>
      <FastImage
        style={StyleSheet.absoluteFill}
        source={{
          uri,
          priority,
          cache: FastImage.cacheControl.immutable,
        }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        resizeMode={FastImage.resizeMode.cover}
        {...rest}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={FotpuColors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  placeholder: {
    overflow: 'hidden',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
