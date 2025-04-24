import { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { firestore } from '../../utils/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import palette from '../../theme/palette';
import { HeaderTriple } from '../../components/Header/Header';
import { Iconify } from 'react-native-iconify';

// Screen Dimensions
const { width, height } = Dimensions.get('window');

export default function Leaderboard() {
    const { user } = useAuth();
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const usersRef = collection(firestore, 'users');
                const q = query(usersRef, orderBy('points', 'desc')); // Order users by score
                const snapshot = await getDocs(q);
                const users = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Assign ranks with ties handled
                let rankedUsers = [];
                let rank = 1;
                let prevScore = null;
                let actualRank = 1;

                users.forEach((user, index) => {
                    if (prevScore !== null && user.points < prevScore) {
                        actualRank = rank;
                    }
                    rankedUsers.push({ ...user, rank: actualRank });
                    prevScore = user.points;
                    rank++;
                });

                setLeaderboardData(rankedUsers);
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: palette.secondary.main }}>
                <ActivityIndicator size="large" color={palette.primary.main} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, width: width, height: height, backgroundColor: palette.secondary.main }}>
            <View style={{ padding: 20 }}>
                <HeaderTriple title="LEADERBOARD" style={{ fontWeight: '700', fontSize: 17, marginVertical: 10 }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', padding: 20 }}>
                {leaderboardData.length >= 3 && (
                    <>
                        <View style={{ alignItems: 'center', marginHorizontal: 20 }}>
                            <Image
                                source={leaderboardData[1]?.photoURL ? { uri: leaderboardData[1]?.photoURL } : require("../../../assets/profile.jpeg")}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    borderWidth: 3,
                                    borderColor: '#C0C0C0', // Silver
                                }}
                            />
                            <Text style={{ fontSize: 30, fontWeight: 700 }}>02</Text>
                            <Text style={{ fontSize: 16, fontWeight: 700 }}>{leaderboardData[1]?.firstName} {leaderboardData[1]?.lastName}</Text>
                            <View
                                style={{
                                    backgroundColor: '#e5e5e5',
                                    paddingVertical: 5,
                                    paddingHorizontal: 8,
                                    borderRadius: 20,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                            >
                                <Iconify icon="twemoji:coin" color={palette.primary.main} size={15} />
                                <Text style={{ fontWeight: 700, fontSize: 12, marginLeft: 12 }}>{leaderboardData[1]?.points}</Text>
                            </View>
                        </View>

                        <View style={{ alignItems: 'center', marginHorizontal: 20 }}>
                            <Image
                                source={leaderboardData[0]?.photoURL ? { uri: leaderboardData[0]?.photoURL } : require("../../../assets/profile.jpeg")}
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 50,
                                    borderWidth: 3,
                                    borderColor: '#FFD700', // Gold
                                }}
                            />
                            <Text style={{ fontSize: 30, fontWeight: 700 }}>01</Text>
                            <Text style={{ fontSize: 18, fontWeight: 700 }}>{leaderboardData[0]?.firstName} {leaderboardData[0]?.lastName}</Text>
                            <View
                                style={{
                                    backgroundColor: '#e5e5e5',
                                    paddingVertical: 5,
                                    paddingHorizontal: 8,
                                    borderRadius: 20,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                            >
                                <Iconify icon="twemoji:coin" color={palette.primary.main} size={15} />
                                <Text style={{ fontWeight: 700, fontSize: 12, marginLeft: 12 }}>{leaderboardData[0]?.points}</Text>
                            </View>
                        </View>

                        {/* Rank 3 (Right) */}
                        <View style={{ alignItems: 'center', marginHorizontal: 20 }}>
                            <Image
                                source={leaderboardData[2]?.photoURL ? { uri: leaderboardData[2]?.photoURL } : require("../../../assets/profile.jpeg")}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    borderWidth: 3,
                                    borderColor: '#CD7F32', // Bronze
                                }}
                            />
                            <Text style={{ fontSize: 30, fontWeight: 700 }}>03</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{leaderboardData[2]?.firstName} {leaderboardData[2]?.lastName}</Text>
                            <View
                                style={{
                                    backgroundColor: '#e5e5e5',
                                    paddingVertical: 5,
                                    paddingHorizontal: 8,
                                    borderRadius: 20,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                            >
                                <Iconify icon="twemoji:coin" color={palette.primary.main} size={15} />
                                <Text style={{ fontWeight: 700, fontSize: 12, marginLeft: 12 }}>{leaderboardData[2]?.points}</Text>
                            </View>
                        </View>
                    </>
                )}
            </View>

            {/* Remaining Users */}
            <View style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 60,
                borderTopRightRadius: 60,
                flex: 1,
                padding: 20
            }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {leaderboardData.slice(3).map((user) => (
                        <View key={user.id} style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingVertical: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: '#eee'
                        }}>
                            {user.rank < 10 ? (
                                <Text style={{ fontSize: 26, fontWeight: 700 }}>0{user.rank}</Text>
                            ) : (
                                <Text style={{ fontSize: 26, fontWeight: 700 }}>{user.rank}</Text>
                            )}
                            <Text style={{ fontSize: 18, fontWeight: 700 }}>{user.firstName} {user.lastName}</Text>
                            <View
                                style={{
                                    backgroundColor: '#e5e5e5',
                                    paddingVertical: 5,
                                    paddingHorizontal: 8,
                                    borderRadius: 20,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                            >
                                <Iconify icon="twemoji:coin" color={palette.primary.main} size={15} />
                                <Text style={{ fontWeight: 700, fontSize: 12, marginLeft: 12 }}>{user.points}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
