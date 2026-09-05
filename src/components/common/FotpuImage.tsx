import React, { useState } from 'react';
import { StyleSheet, View, Image, ImageProps } from 'react-native';

interface FotpuImageProps extends Omit<ImageProps, 'source'> {
  uri?: string | null;
  containerClassName?: string;
}

export const FotpuImage: React.FC<FotpuImageProps> = ({
  uri,
  style,
  containerClassName = '',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  if (!uri || hasError) {
    return (
      <View
        style={[styles.placeholder, style]}
      />
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        style={StyleSheet.absoluteFill}
        source={{ uri }}
        onError={() => setHasError(true)}
        resizeMode="cover"
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  placeholder: {
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
});
