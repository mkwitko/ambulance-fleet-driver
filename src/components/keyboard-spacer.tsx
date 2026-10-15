import { useEffect, useState } from "react";
import { Keyboard, Platform, View } from "react-native";

export default function KeyboardSpacer() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      if (Platform.OS === "android") {
        setHeight(e.endCoordinates.height);
      }
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return <View style={{ height }} />;
}
