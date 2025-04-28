import { View, Image } from 'react-native';
import { Text } from 'react-native-paper';
// components
import palette from '../../theme/palette';
import { Iconify } from 'react-native-iconify';
import Star from '../../components/Icon/Star';

// ----------------------------------------------------------------------

export default function LeaderboardTop({ leaderboardData, width }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', padding: 20, paddingBottom: 80 }}>
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

            <Star />

            {leaderboardData.length >= 3 && (
                <View style={{ position: 'relative', width: 320, height: 200, zIndex: 2 }}>
                    <View
                        style={{
                            alignItems: 'center',
                            marginHorizontal: 5,
                            position: 'absolute',
                            width: width * 0.75,
                            height: 200,
                            top: 50,
                            left: -110,
                        }}
                    >
                        <Image
                            source={leaderboardData[1]?.photoURL ? { uri: leaderboardData[1]?.photoURL } : require("../../../assets/profile.jpeg")}
                            style={{
                                width: 75,
                                height: 75,
                                borderRadius: 40,
                                marginBottom: 20,
                            }}
                        />
                        
                        <Text style={{ fontWeight: 700, marginBottom: 5 }}>{leaderboardData[1]?.firstName} {leaderboardData[1]?.lastName}</Text>
                        
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
                            <Text style={{ fontWeight: 700, fontSize: 11, marginLeft: 4 }}>{leaderboardData[1]?.totalPoints}</Text>
                        </View>
                    </View>

                    <View
                        style={{
                            alignItems: 'center',
                            marginHorizontal: 5,
                            position: 'absolute',
                            width: width * 0.75,
                            height: 200,
                            top: 0,
                        }}
                    >
                        <Image
                            source={leaderboardData[0]?.photoURL ? { uri: leaderboardData[0]?.photoURL } : require("../../../assets/profile.jpeg")}
                            style={{
                                width: 75,
                                height: 75,
                                borderRadius: 50,
                                marginBottom: 20,
                            }}
                        />
                        
                        <Text style={{ fontWeight: 700, marginBottom: 5 }}>{leaderboardData[0]?.firstName} {leaderboardData[0]?.lastName}</Text>
                        
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
                            <Text style={{ fontWeight: 700, fontSize: 11, marginLeft: 4 }}>{leaderboardData[0]?.totalPoints}</Text>
                        </View>
                    </View>

                    <View
                        style={{
                            alignItems: 'center',
                            marginHorizontal: 5,
                            position: 'absolute',
                            width: width * 0.75,
                            height: 200,
                            top: 90,
                            right: -110,
                        }}
                    >
                        <Image
                            source={leaderboardData[2]?.photoURL ? { uri: leaderboardData[2]?.photoURL } : require("../../../assets/profile.jpeg")}
                            style={{
                                width: 75,
                                height: 75,
                                borderRadius: 40,
                                marginBottom: 20,
                            }}
                        />
                        
                        <Text style={{ fontWeight: 700, marginBottom: 5 }}>
                            {`${leaderboardData[2]?.firstName || ''} ${leaderboardData[2]?.lastName || ''}`.length > 13
                                ? `${`${leaderboardData[2]?.firstName || ''} ${leaderboardData[2]?.lastName || ''}`.slice(0, 13)}..`
                                : `${leaderboardData[2]?.firstName || ''} ${leaderboardData[2]?.lastName || ''}`}
                        </Text>

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
                            <Text style={{ fontWeight: 700, fontSize: 11, marginLeft: 4 }}>{leaderboardData[2]?.totalPoints}</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}