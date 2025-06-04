import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const WaveBackgroundTop = () => {
    return (
        <>
            <View style={styles.waveContainer}>
                <Svg
                    height="500"
                    width="100%"
                    viewBox="0 0 1440 320"
                >
                    <Path
                        fill="#2695a6"
                        d="M 1 422 C 159 502 253 426 421 462 C 676 564 819 678 1052 650 C 1199 645 1321.3333 589.3333 1449 569 L 1434 -202 L 0 -209 Z"
                    />
                </Svg>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    waveContainer: {
        position: "absolute",
        top: -150,
        left: 0,
        right: 0,
        zIndex: -1,
    },
});

export default WaveBackgroundTop;
