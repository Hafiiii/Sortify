import { View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

// ----------------------------------------------------------------------

export default function CircularProgress({ size = 160, strokeWidth = 12, value }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const percentage = 80;
    const strokeDashoffset = circumference - (circumference * percentage) / 100;

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Svg width={size} height={size}>
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="100%" stopColor="#fff" />
                        <Stop offset="0%" stopColor="#000" />
                    </LinearGradient>
                </Defs>

                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#fff"
                    strokeWidth={strokeWidth}
                    fill="#fff"
                />

                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#grad)"
                    strokeWidth={strokeWidth}
                    fill="#fff"
                    strokeDasharray={`${circumference}, ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="70"
                    originX={size / 2}
                    originY={size / 2}
                />
            </Svg>

            <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: parseFloat(value) % 1 === 0 ? 20 : 17, fontWeight: 700 }}>
                    RM {parseFloat(value) % 1 === 0 ? parseInt(value) : parseFloat(value).toFixed(2)}
                </Text>
            </View>
        </View>
    );
}