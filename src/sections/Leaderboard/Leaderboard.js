import { useState, useEffect } from 'react';
import { View, Image, Dimensions, ScrollView } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
// auth
import { useAuth } from '../../context/AuthContext';
// firebase
import { firestore } from '../../utils/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
// components
import palette from '../../theme/palette';
import { HeaderTriple } from '../../components/Header/Header';
import { Iconify } from 'react-native-iconify';
import Toast from 'react-native-toast-message';
import Star from '../../components/Icon/Star';
import LeaderboardBottom from './LeaderboardBottom';
import LeaderboardTop from './LeaderboardTop';
import ErrorScreen from '../../components/ErrorScreen/ErrorScreen';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

// ----------------------------------------------------------------------

export default function Leaderboard() {
    const { user } = useAuth();
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const usersRef = collection(firestore, 'users');
                const q = query(usersRef, orderBy('totalPoints', 'desc'));
                const snapshot = await getDocs(q);

                const users = snapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    .filter(user => user.isDeleted !== true && user.userId > 5);

                let rankedUsers = [];
                let rank = 1;
                let prevScore = null;
                let actualRank = 1;

                users.forEach((user, index) => {
                    if (prevScore !== null && user.totalPoints < prevScore) {
                        actualRank = rank;
                    }
                    rankedUsers.push({ ...user, rank: actualRank });
                    prevScore = user.totalPoints;
                    rank++;
                });

                setLeaderboardData(rankedUsers);
            } catch (error) {
                setError(true);

                Toast.show({
                    type: 'error',
                    text1: 'Error fetching leaderboard data.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, width: width, height: height, backgroundColor: palette.secondary.main }}>
            {error ? (
                <ErrorScreen
                    message="Failed to load leaderboard data. Please try again later."
                    onRetry={() => {
                        setLoading(true);
                        setError(false);
                    }}
                />
            ) : (
                <>
                    <View style={{ padding: 20 }}>
                        <HeaderTriple title="LEADERBOARD" style={{ fontWeight: '700', fontSize: 17, marginVertical: 10 }} />
                    </View>

                    <LeaderboardTop leaderboardData={leaderboardData} width={width} />
                    <LeaderboardBottom leaderboardData={leaderboardData} />
                </>
            )}
        </View>
    );
}