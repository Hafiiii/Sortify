import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Chip } from 'react-native-paper';
// @react-navigation
import { useFocusEffect } from '@react-navigation/native';
// auth
import { useAuth } from '../context/AuthContext';
// firebase
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../utils/firebase';
// chart
import { PieChart, LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import ViewShot from 'react-native-view-shot';
// components
import Share from 'react-native-share';
import { Iconify } from 'react-native-iconify';
import palette from '../theme/palette';
import { HeaderTriple } from '../components/Header/Header';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

// ----------------------------------------------------------------------

export default function StatisticsScreen() {
    const { user } = useAuth();
    const chartRef = useRef(null);
    const [selectedFilter, setSelectedFilter] = useState('Weekly');
    const [selectedDate, setSelectedDate] = useState(moment());
    const [wasteData, setWasteData] = useState([]);

    const fetchUserWastes = async () => {
        if (!user?.uid) return;

        try {
            const wastesCollectionRef = collection(firestore, 'wastes');
            const q = query(wastesCollectionRef, where('uid', '==', user?.uid));
            const wastesSnapshot = await getDocs(q);

            if (!wastesSnapshot.empty) {
                const wastesList = wastesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setWasteData(wastesList);
            } else {
                Toast.show({
                    type: 'error',
                    text1: "Oops! You haven't scanned any waste item yet.",
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'An error occurred while fetching wastes.',
            });
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (user?.uid) {
                fetchUserWastes();
            }
        }, [user?.uid])
    );

    const getWeekDates = (date) =>
        Array.from({ length: 7 }, (_, i) => moment(date).startOf('week').add(i, 'days').format('YYYY-MM-DD'));

    const [weekDates, setWeekDates] = useState(getWeekDates(selectedDate));

    useEffect(() => {
        setWeekDates(getWeekDates(selectedDate));
    }, [selectedDate]);

    const changeDate = (direction) => {
        setSelectedDate(moment(selectedDate).add(direction, selectedFilter === 'Weekly' ? 'weeks' : selectedFilter === 'Monthly' ? 'months' : 'years'));
    };

    const generateData = () => {
        const dateFormat = selectedFilter === 'Weekly' ? 'YYYY-MM-DD' : 'YYYY-MM';
        let dateRange = [];

        if (selectedFilter === 'Weekly') {
            dateRange = getWeekDates(selectedDate);
        } else if (selectedFilter === 'Monthly') {
            dateRange = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        } else if (selectedFilter === 'Yearly') {
            const currentYear = moment().year();
            dateRange = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2]; // Example: 5 years range
        }

        const labels = dateRange.map((dateLabel) => {
            if (selectedFilter === 'Weekly') {
                return moment(dateLabel).format('D MMM');
            } else {
                return dateLabel;
            }
        });

        const data = dateRange.map((dateLabel) => {
            let count = 0;

            wasteData.forEach((item) => {
                const itemTimestamp = item.dateAdded.seconds * 1000 + item.dateAdded.nanoseconds / 1000000;
                const itemDate = moment(itemTimestamp);

                const formattedDate =
                    selectedFilter === 'Weekly'
                        ? moment(dateLabel).format('YYYY-MM-DD')
                        : selectedFilter === 'Monthly'
                            ? moment().month(dateLabel).format('YYYY-MM')
                            : moment(dateLabel).format('YYYY');

                if (selectedFilter === 'Yearly') {
                    if (itemDate.year() === parseInt(dateLabel)) {
                        count++;
                    }
                } else {
                    if (itemDate.format(dateFormat) === formattedDate) {
                        count++;
                    }
                }
            });

            return count;
        });

        return { labels, data };
    };

    const lineData = {
        labels: generateData().labels,
        datasets: [
            {
                label: 'Waste Count',
                data: generateData().data,
                tension: 0.4,
            },
        ],
    };

    const shareChart = async () => {
        if (!chartRef.current) return;
        try {
            const uri = await chartRef.current.capture();
            await Share.open({ url: uri, message: 'Check out my waste statistics!' });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    const generateRainbowPastelColors = (count) => {
        return Array.from({ length: count }, (_, i) => {
            const hue = Math.floor((360 / count) * i);
            return `hsl(${hue}, 70%, 70%)`;
        });
    };

    const wasteTypes = Array.from(
        wasteData.reduce((map, item) => {
            const type = item.wasteType;
            if (!map.has(type)) {
                map.set(type, { type, total: 0 });
            }
            map.get(type).total += item.amount || 1;
            return map;
        }, new Map()).values()
    );

    const pieData = wasteTypes.map((entry, i) => ({
        name: entry.type,
        population: entry.total,
        color: generateRainbowPastelColors(wasteTypes.length)[i],
    }));

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#fff' }}>
            <View
                style={{
                    backgroundColor: palette.primary.main,
                    height: selectedFilter === 'Weekly' ? height * 0.55 : height * 0.5,
                    padding: 30,
                    paddingTop: 15,
                    borderBottomLeftRadius: 60,
                    borderBottomRightRadius: 60,
                }}
            >
                <HeaderTriple title="Statistics" style={{ fontWeight: 'bold' }} />

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                    {['Weekly', 'Monthly', 'Yearly'].map((item) => (
                        <Chip
                            key={item}
                            mode="flat"
                            onPress={() => setSelectedFilter(item)}
                            selected={selectedFilter === item}
                            showSelectedCheck={false}
                            style={{
                                borderRadius: 20,
                                marginHorizontal: 5,
                                backgroundColor: selectedFilter === item ? palette.secondary.main : '#fff',
                            }}
                            textStyle={{ color: '#000', fontSize: 12 }}
                        >
                            {item}
                        </Chip>
                    ))}
                </View>

                <View style={{ alignItems: 'center', marginVertical: 10, }}>
                    <LineChart
                        data={lineData}
                        width={width - 40}
                        height={220}
                        withShadow={false}
                        chartConfig={{
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            decimalPlaces: 0,
                            color: (opacity = 1) => palette.secondary.main + Math.round(opacity * 255).toString(16).padStart(2, '0'),
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            propsForDots: { r: '3' },
                        }}
                        style={{ borderRadius: 10, borderColor: '#000', borderWidth: 1, backgroundColor: '#fff', paddingVertical: 10 }}
                    />
                </View>

                {selectedFilter === 'Weekly' && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                        <TouchableOpacity onPress={() => changeDate(-1)} style={{ padding: 10 }}>
                            <Iconify icon="ri:arrow-left-s-line" size={24} />
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', gap: 3 }}>
                            {weekDates.map((date, index) => (
                                <TouchableOpacity key={index} onPress={() => setSelectedDate(moment(date))} style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Text
                                        style={{
                                            borderRadius: 100,
                                            paddingHorizontal: 5,
                                            backgroundColor: selectedDate.format('YYYY-MM-DD') === date ? palette.secondary.main : 'transparent',
                                            fontWeight: selectedDate.format('YYYY-MM-DD') === date ? 700 : 400,
                                            marginBottom: selectedDate.format('YYYY-MM-DD') === date ? 3 : 0,
                                        }}
                                    >
                                        {moment(date).format('D')}
                                    </Text>
                                    <Text
                                        style={{
                                            paddingHorizontal: 5,
                                            fontSize: 11,
                                            marginTop: selectedDate.format('YYYY-MM-DD') === date ? 2 : 0,
                                            color: selectedDate.format('YYYY-MM-DD') === date ? palette.secondary.main : '#000'
                                        }}
                                    >
                                        {moment(date).format('MMM')}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity onPress={() => changeDate(1)} style={{ padding: 10 }}>
                            <Iconify icon="ri:arrow-right-s-line" size={24} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={{ alignItems: 'center', marginBottom: 150 }}>
                <View style={{ position: 'relative', width: width, height: 220 }}>
                    <ViewShot ref={chartRef} options={{ format: 'jpg', quality: 0.9 }}>
                        <PieChart
                            data={pieData}
                            width={width - 40}
                            height={220}
                            chartConfig={{
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                backgroundGradientFrom: '#fff',
                                backgroundGradientTo: '#fff',
                            }}
                            accessor={'population'}
                            backgroundColor={'transparent'}
                            hasLegend={false}
                            center={[110, 0]}
                        />

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15, alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                            {pieData.map((entry, index) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                                    <View
                                        style={{
                                            width: 12,
                                            height: 12,
                                            backgroundColor: entry.color,
                                            borderTopRightRadius: '100%',
                                        }}
                                    />
                                    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 12, fontWeight: 700, color: palette.disabled.secondary }}>
                                            {entry.population}
                                        </Text>
                                        <Text style={{ fontSize: 12, fontWeight: 700, color: palette.disabled.secondary }}>
                                            {entry.name}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ViewShot>

                    <TouchableOpacity
                        onPress={shareChart}
                        style={{
                            position: 'absolute',
                            bottom: '10%',
                            right: '30%',
                        }}
                    >
                        <Iconify icon="rivet-icons:share" size={18} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView >
    );
}
