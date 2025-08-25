import React from 'react';
import { Platform, StatusBar, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SafeAreaWrapper = ({
  children,
  scrollable = false,
  className = '',
  style = {},
  contentContainerClassName = '',
}) => {
  const paddingTop = Platform.OS === 'android' ? 0 || 0 : 0;

  if (scrollable) {
    return (
      <SafeAreaView
        style={[{ flex: 1, paddingTop }, style]}
        className={`bg-light-background dark:bg-dark-background ${className}`}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          className="flex-1"
          contentContainerClassName={contentContainerClassName}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[{ flex: 1, paddingTop }, style]}
      className={`${className}`}
    >
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaWrapper;
