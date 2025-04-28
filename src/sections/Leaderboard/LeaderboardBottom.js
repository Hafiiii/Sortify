import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
// components
import palette from '../../theme/palette';
import { Iconify } from 'react-native-iconify';

// ----------------------------------------------------------------------

export default function LeaderboardBottom({ leaderboardData }) {
    return (
        <View
            style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                flex: 1,
                padding: 20,
            }}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                {leaderboardData.slice(3).map((user) => (
                    <View key={user.id} style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee'
                    }}>
                        {user.rank < 10 ? (
                            <Text style={{ fontSize: 16, fontWeight: 700 }}>0{user.rank}</Text>
                        ) : (
                            <Text style={{ fontSize: 16, fontWeight: 700 }}>{user.rank}</Text>
                        )}

                        <Text style={{ fontWeight: 700 }}>{user.firstName} {user.lastName}</Text>

                        <View
                            style={{
                                backgroundColor: '#e5e5e5',
                                paddingVertical: 4,
                                paddingHorizontal: 7,
                                borderRadius: 20,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Iconify icon="twemoji:coin" color={palette.primary.main} size={11} />
                            <Text style={{ fontWeight: 700, fontSize: 11, marginLeft: 4 }}>{user.totalPoints}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}