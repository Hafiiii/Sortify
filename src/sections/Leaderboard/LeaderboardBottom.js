import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
// components
import ModalPoints from '../../components/Points/ModalPoints';

// ----------------------------------------------------------------------

export default function LeaderboardBottom({ leaderboardData }) {
    return (
        <View
            style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                flex: 1,
                paddingHorizontal: 20,
                paddingTop: 20
            }}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 80, }} showsVerticalScrollIndicator={false}>
                {leaderboardData.slice(3, 30).map((user) => (
                    <View
                        key={user.id}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingVertical: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: '#eee',
                            gap: 3,
                        }}
                    >
                        {user.rank < 10 ? (
                            <Text style={{ fontSize: 18, fontWeight: 700, maxWidth: '10%' }}>0{user.rank}</Text>
                        ) : (
                            <Text style={{ fontSize: 18, fontWeight: 700, maxWidth: '10%' }}>{user.rank}</Text>
                        )}

                        <Text style={{ fontWeight: 700, width: '65%', textAlign: 'center' }} numberOfLines={1} ellipsizeMode="tail">{user.firstName} {user.lastName}</Text>

                        <ModalPoints data={user.totalPoints} style={{ maxWidth: '17%' }} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}