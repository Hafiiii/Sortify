import { View } from 'react-native';
import { Text } from 'react-native-paper';
// components
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export default function ScoreDisplay({ score, wrongCount }) {
    const maxMistakes = 3;

    const mistakeIcons = Array.from({ length: maxMistakes }, (_, index) => (
        <Text key={index} style={{ fontSize: 18 }}>
            {index < wrongCount ? '❌' : '♻️'}
        </Text>
    ));

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10, marginBottom: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                    style={{
                        height: 40,
                        width: 40,
                        borderRadius: 100,
                        backgroundColor: palette.primary.light,
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        borderWidth: 2,
                        borderColor: palette.primary.main,
                    }}
                >
                    <Text style={{ fontSize: 20 }}>⭐️</Text>
                </View>

                <View
                    style={{
                        height: 30,
                        width: 80,
                        borderRadius: 100,
                        backgroundColor: palette.primary.light,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: -20,
                        zIndex: 8,
                        borderWidth: 2,
                        borderColor: palette.primary.main,
                    }}
                >
                    <Text style={{ fontWeight: 700, marginRight: -10, }}>{score}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {mistakeIcons}
            </View>
        </View>
    );
}