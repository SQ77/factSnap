import { View, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomStatusBar = ({ backgroundColor, barStyle = "dark" }) => {
    const insets = useSafeAreaInsets();

    return (
        <>
            {Platform.OS === "ios" && (
                <View
                    style={{
                        height: insets.top + 5,
                        backgroundColor,
                        width: "100%",
                        position: "absolute",
                        top: -50,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                    }}
                />
            )}
            <StatusBar translucent backgroundColor={backgroundColor} style={barStyle} />
        </>
    );
};

export default CustomStatusBar;
