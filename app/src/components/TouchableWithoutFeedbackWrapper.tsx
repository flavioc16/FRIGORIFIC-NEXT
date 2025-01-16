import React from 'react';
import { TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';

const TouchableWithoutFeedbackWrapper = ({ onPress, children }: { onPress: () => void, children: React.ReactNode }) => {
  // Somente no web, usar um div ou span
  if (Platform.OS === 'web') {
    return <div onClick={onPress}>{children}</div>;
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export { TouchableWithoutFeedbackWrapper };
