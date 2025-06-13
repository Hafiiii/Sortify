import { View, Image } from 'react-native';
import { Text } from 'react-native-paper';
// components
import { Star1 } from '../../components/Icon/Star';
import ModalPoints from '../../components/Points/ModalPoints';

// ----------------------------------------------------------------------

export default function LeaderboardTop({ leaderboardData, width }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', padding: 20, paddingBottom: 60 }}>
            <Image
                source={require("../../../assets/leaderboard-podium.png")}
                style={{
                    position: 'absolute',
                    width: width * 0.85,
                    height: 200,
                    top: 70,
                    zIndex: 0,
                }}
            />

            <Star1 />

            {leaderboardData.length > 0 && (
                <View style={{ position: 'relative', width: 320, height: 200, zIndex: 2 }}>
                    {leaderboardData.length > 1 &&
                        <RankPodium
                            leaderboardData={leaderboardData}
                            width={width}
                            index={1}
                            style={{ top: 50, left: -115 }}
                        />
                    }

                    <RankPodium
                        leaderboardData={leaderboardData}
                        width={width}
                        index={0}
                        style={{ top: 0 }}
                    />

                    {leaderboardData.length > 2 &&
                        <RankPodium
                            leaderboardData={leaderboardData}
                            width={width}
                            index={2}
                            style={{ top: 90, right: -110 }}
                        />
                    }
                </View>
            )}
        </View>
    );
}

function RankPodium({ leaderboardData, width, index, style = {} }) {
    return (
        <View
            style={{
                alignItems: 'center',
                marginHorizontal: 5,
                position: 'absolute',
                width: width * 0.75,
                height: 200,
                ...style,
            }}
        >
            <Image
                source={leaderboardData[index]?.photoURL ? { uri: leaderboardData[index]?.photoURL } : require("../../../assets/profile.jpeg")}
                style={{
                    width: 75,
                    height: 75,
                    borderRadius: 40,
                    marginBottom: 20,
                }}
            />

            <Text
                style={{
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 3,
                    maxWidth: 100,
                    textAlign: 'center',
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {leaderboardData[index]?.firstName} {leaderboardData[index]?.lastName}
            </Text>

            <ModalPoints data={leaderboardData[index]?.totalPoints} style={{ maxWidth: 100, paddingVertical: 1 }} />
        </View>
    );
}