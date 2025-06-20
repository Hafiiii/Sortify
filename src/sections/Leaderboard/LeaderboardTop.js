import { View, Image } from 'react-native';
import { Text } from 'react-native-paper';
// components
import { Star1 } from '../../components/Icon/Star';
import ModalPoints from '../../components/Points/ModalPoints';

// ----------------------------------------------------------------------

export default function LeaderboardTop({ leaderboardData, width }) {
    return (
        <View style={{ alignItems: 'center', paddingBottom: 30 }}>
            <Image
                source={require("../../../assets/leaderboard-podium.webp")}
                style={{
                    position: 'absolute',
                    width: 400,
                    height: 200,
                    top: 40,
                    zIndex: 1,
                }}
                resizeMode="contain"
            />

            <Star1 />

            {leaderboardData.length > 0 && (
                <View style={{ position: 'relative', width: 400, height: 230, zIndex: 2 }}>
                    {leaderboardData[1] && (
                        <RankPodium
                            leaderboardData={leaderboardData}
                            index={1}
                            style={{ position: 'absolute', left: 400 * 0.10, bottom: 50 }}
                        />
                    )}

                    <RankPodium
                        leaderboardData={leaderboardData}
                        index={0}
                        style={{ position: 'absolute', left: 400 * 0.37, bottom: 95 }}
                    />

                    {leaderboardData[2] && (
                        <RankPodium
                            leaderboardData={leaderboardData}
                            index={2}
                            style={{ position: 'absolute', left: 400 * 0.64, bottom: 10 }}
                        />
                    )}
                </View>
            )}
        </View>
    );
}

function RankPodium({ leaderboardData, width, index, style = {} }) {
    return (
        <View style={{ alignItems: 'center', width: 100, position: 'relative', ...style }}>
            <Image
                source={leaderboardData[index]?.photoURL ? { uri: leaderboardData[index]?.photoURL } : require("../../../assets/profile.webp")}
                style={{ width: 75, height: 75, borderRadius: 40, marginBottom: 18 }}
            />

            <Text
                style={{
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 2,
                    maxWidth: 100,
                    textAlign: 'center',
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {leaderboardData[index]?.firstName} {leaderboardData[index]?.lastName}
            </Text>

            <ModalPoints data={leaderboardData[index]?.totalPoints} style={{ maxWidth: 100, paddingVertical: 1 }} />
        </View>
    );
}