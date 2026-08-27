import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
  StyleSheet,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'dark' | 'outline' | 'pastel';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...rest
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryBtn;
      case 'dark':
        return styles.darkBtn;
      case 'secondary':
        return styles.secondaryBtn;
      case 'pastel':
        return styles.pastelBtn;
      case 'outline':
        return styles.outlineBtn;
      default:
        return styles.primaryBtn;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'pastel':
        return styles.pastelText;
      case 'outline':
        return styles.outlineText;
      case 'dark':
      case 'primary':
      default:
        return styles.whiteText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.smSize;
      case 'lg':
        return styles.lgSize;
      case 'md':
      default:
        return styles.mdSize;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || isLoading}
      style={[
        styles.baseButton,
        getSizeStyle(),
        getContainerStyle(),
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' ? '#333333' : '#FFFFFF'}
        />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={[styles.baseText, getTextStyle()]}>{title}</Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  smSize: {
    height: 42,
    paddingHorizontal: 16,
  },
  mdSize: {
    height: 50,
    paddingHorizontal: 20,
  },
  lgSize: {
    height: 56,
    paddingHorizontal: 24,
  },
  primaryBtn: {
    backgroundColor: '#ff6e61',
    shadowColor: '#ff6e61',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  darkBtn: {
    backgroundColor: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  pastelBtn: {
    backgroundColor: '#E6E6FA',
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#ff6e61',
  },
  disabled: {
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  baseText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  whiteText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#333333',
  },
  pastelText: {
    color: '#181110',
  },
  outlineText: {
    color: '#ff6e61',
  },
});
