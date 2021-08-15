import React, { useRef } from "react";
import { View } from "react-native";

const OTPVerification = () => {
  const otpInput = useRef(null);

  const clearText = () => {
    otpInput.current.clear();
  };

  const setText = () => {
    otpInput.current.setValue("1234");
  };

  return (
    <View>
      <OTPTextInput ref={(e) => (otpInput = e)} />
      <Button title="clear" onClick={clearText} />
    </View>
  );
};

export default OTPVerification;
