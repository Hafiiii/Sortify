import { useEffect, useState, useMemo } from 'react';
import { View, Dimensions, Image } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');
const TWO_PI = 2 * Math.PI;

const categories = [
  {
    id: '1',
    categoryImageURL: require('../../../assets/soda-can.png'),
    facts: 'Recycling one aluminum can saves enough energy to power a TV for 3 hours!',
  },
  {
    id: '2',
    categoryImageURL: require('../../../assets/glass-bottle.png'),
    facts: 'Glass can be recycled endlessly without losing quality.',
  },
  {
    id: '3',
    categoryImageURL: require('../../../assets/plastic.png'),
    facts: 'Only 9% of plastic ever made has been recycled.',
  },
  {
    id: '4',
    categoryImageURL: require('../../../assets/banana-peel.png'),
    facts: 'Banana peels and food scraps belong in the compost—not the trash!',
  },
  {
    id: '5',
    categoryImageURL: require('../../../assets/headphones.png'),
    facts: 'E-waste makes up just 2% of trash but 70% of toxic waste.',
  },
  {
    id: '6',
    categoryImageURL: require('../../../assets/newspaper.png'),
    facts: 'Paper can be recycled up to 7 times before the fibers become too short.',
  },
  {
    id: '7',
    categoryImageURL: require('../../../assets/plastic-pile.png'),
    facts: 'Recycling 1 ton of plastic saves 7.4 cubic yards of landfill space.',
  },
  {
    id: '8',
    categoryImageURL: require('../../../assets/waste-bin.png'),
    facts: 'Sorting waste properly reduces greenhouse gas emissions.',
  },
];

const CENTER_X = width / 3.5;
const CENTER_Y = height / 6.5;
const RADIUS = 100;

// ----------------------------------------------------------------------

export default function WasteCategoryCarousel() {
  const rotation = useSharedValue(0);
  const [centeredIndex, setCenteredIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      rotation.value = withTiming(rotation.value + (TWO_PI / categories.length), {
        duration: 800,
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useDerivedValue(() => {
    const angles = categories.map((_, index) => {
      const angleOffset = (index * TWO_PI) / categories.length;
      const angle = rotation.value + angleOffset;
      const normalized = ((angle % TWO_PI) + TWO_PI) % TWO_PI;
      const distanceToFront = Math.min(normalized, TWO_PI - normalized);
      return { index, distanceToFront };
    });

    const closest = angles.reduce((min, curr) =>
      curr.distanceToFront < min.distanceToFront ? curr : min
    );

    runOnJS(setCenteredIndex)(closest.index);
  }, [rotation]);

  const currentItem = useMemo(() => categories[centeredIndex], [centeredIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    const angleOffset = (centeredIndex * TWO_PI) / categories.length;
    const angle = rotation.value + angleOffset;
    const x = CENTER_X + RADIUS * Math.cos(angle) - 220;
    const y = CENTER_Y + RADIUS * Math.sin(angle) - 110;

    return {
      position: 'absolute',
      transform: [{ translateX: x }, { translateY: y }],
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        key={currentItem.id}
        style={[
          {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          },
          animatedStyle,
        ]}
      >
        <View
          style={{
            width: '30%',
            maxHeight: 130,
            borderRadius: 500,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#fff',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 20,
            elevation: 20,
          }}
        >
          <Image
            source={currentItem.categoryImageURL}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        </View>

        <View style={{ backgroundColor: '#fff', height: 80, width: 4 }} />

        <Text style={{ width: '50%', padding: 5, lineHeight: 20, fontWeight: 700, color: '#fff' }}>
          {currentItem.facts}
        </Text>
      </Animated.View>
    </View>
  );
}