import palette from '../../theme/palette';
import { useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

// ----------------------------------------------------------------------

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ----------------------------------------------------------------------

export default function CircularProgress({ size = 145, strokeWidth = 12, value, blink }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const percentage = 80;
    const strokeDashoffset = circumference - (circumference * percentage) / 100;
    const blinkOpacity = useRef(new Animated.Value(0)).current;
    const gradientOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (blink) {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(blinkOpacity, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: false,
                    }),
                    Animated.timing(gradientOpacity, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(blinkOpacity, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: false,
                    }),
                    Animated.timing(gradientOpacity, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: false,
                    }),
                ]),
            ]).start();
        }
    }, [blink]);

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

                <AnimatedCircle
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
                    opacity={gradientOpacity}
                />

                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={palette.primary.main}
                    strokeWidth={strokeWidth}
                    fill="#fff"
                    strokeDasharray={`${circumference}, ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="70"
                    originX={size / 2}
                    originY={size / 2}
                    opacity={blinkOpacity}
                />
            </Svg>

            <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: parseFloat(value) % 1 === 0 ? 18 : 15.5, fontWeight: 700 }}>
                    RM {parseFloat(value) % 1 === 0 ? parseInt(value) : parseFloat(value).toFixed(2)}
                </Text>
            </View>
        </View>
    );
}