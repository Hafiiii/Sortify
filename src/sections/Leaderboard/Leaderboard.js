import { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
// hooks
import { getAllUsers } from '../../hooks/getAllUsers';
// sections
import LeaderboardBottom from './LeaderboardBottom';
import LeaderboardTop from './LeaderboardTop';
// components
import palette from '../../theme/palette';
import { HeaderTriple } from '../../components/Header/Header';
import Toast from 'react-native-toast-message';
import LoadingIndicator from '../../components/Animated/LoadingIndicator';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

// ----------------------------------------------------------------------

export default function Leaderboard() {
    const { users, loading } = getAllUsers();
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        if (users && Array.isArray(users)) {
            try {
                const filtered = users
                    .filter(user => user.isDeleted !== true && user.userId > 5)
                    .sort((a, b) => b.totalPoints - a.totalPoints);

                let rankedUsers = [];
                let rank = 1;
                let prevScore = null;
                let actualRank = 1;

                filtered.forEach((user, index) => {
                    if (prevScore !== null && user.totalPoints < prevScore) {
                        actualRank = rank;
                    }
                    rankedUsers.push({ ...user, rank: actualRank });
                    prevScore = user.totalPoints;
                    rank++;
                });

                setLeaderboardData(rankedUsers);
            } catch (err) {
                Toast.show({ type: 'error', text1: 'Error processing leaderboard data.', text2: err.message || 'Please try again later.' });
            }
        }
    }, [users]);

    if (loading) return <LoadingIndicator />

    return (
        <View style={{ flex: 1, width: width, height: height, backgroundColor: palette.secondary.main }}>
            <View style={{ padding: 20 }}>
                <HeaderTriple title="LEADERBOARD" style={{ fontWeight: '700', fontSize: 17, marginVertical: 10 }} />
            </View>

            <LeaderboardTop leaderboardData={leaderboardData} width={width} />
            <LeaderboardBottom leaderboardData={leaderboardData} />
        </View>
    );
}
