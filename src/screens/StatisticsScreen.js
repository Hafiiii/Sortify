import { useState, useEffect, useRef } from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import { Iconify } from 'react-native-iconify';
import palette from '../theme/palette';
import { HeaderTriple } from '../components/Header/Header';

const { width, height } = Dimensions.get('window');

const pieData = [
    { name: 'Recyclable', population: 50, color: '#80b564', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'Organic', population: 30, color: '#f4a261', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'Non-Recyclable', population: 20, color: '#e76f51', legendFontColor: '#333', legendFontSize: 14 },
];

export default function StatisticsScreen() {
    const chartRef = useRef(null);
    const [selectedFilter, setSelectedFilter] = useState('Weekly');
    const [selectedDate, setSelectedDate] = useState(moment());

    const getWeekDates = (date) => 
        Array.from({ length: 7 }, (_, i) => moment(date).startOf('week').add(i, 'days').format('YYYY-MM-DD'));

    const [weekDates, setWeekDates] = useState(getWeekDates(selectedDate));

    useEffect(() => {
        setWeekDates(getWeekDates(selectedDate));
    }, [selectedDate]);

    const generateData = () => {
        switch (selectedFilter) {
            case 'Weekly': return { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], data: [20, 40, 30, 50, 60, 80, 100] };
            case 'Monthly': return { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [100, 200, 150, 250] };
            case 'Yearly': return { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [400, 600, 500, 700, 800, 900] };
            default: return { labels: [], data: [] };
        }
    };

    const { labels, data } = generateData();

    const changeDate = (direction) => {
        setSelectedDate(moment(selectedDate).add(direction, selectedFilter === 'Weekly' ? 'weeks' : selectedFilter === 'Monthly' ? 'months' : 'years'));
    };

    const lineData = {
        labels: weekDates.map(date => moment(date).format('MMM D')),
        datasets: [{ data: weekDates.map(() => Math.floor(Math.random() * 50) + 10), strokeWidth: 2 }]
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

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ backgroundColor: palette.primary.main, padding: 30, height: height * 0.55, borderBottomLeftRadius: 60, borderBottomRightRadius: 60 }}>
                <HeaderTriple title="Statistics" style={{ fontWeight: 'bold' }} />

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 15 }}>
                    {['Weekly', 'Monthly', 'Yearly'].map((item) => (
                        <TouchableOpacity key={item} onPress={() => setSelectedFilter(item)} style={{ padding: 10, marginHorizontal: 5, borderRadius: 8, backgroundColor: selectedFilter === item ? palette.primary.dark : '#ddd' }}>
                            <Text style={{ color: selectedFilter === item ? '#fff' : '#000' }}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {selectedFilter === 'Weekly' && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                        <TouchableOpacity onPress={() => changeDate(-1)} style={{ padding: 10 }}>
                            <Iconify icon="ri:arrow-left-s-line" size={24} color="#333" />
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            {weekDates.map((date, index) => (
                                <TouchableOpacity key={index} onPress={() => setSelectedDate(moment(date))}>
                                    <Text style={{ padding: 8, borderRadius: 5, fontSize: 14, color: selectedDate.format('YYYY-MM-DD') === date ? '#fff' : '#333', backgroundColor: selectedDate.format('YYYY-MM-DD') === date ? palette.primary.main : '#f0f0f0' }}>
                                        {moment(date).format('D')}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity onPress={() => changeDate(1)} style={{ padding: 10 }}>
                            <Iconify icon="ri:arrow-right-s-line" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Daily Waste Trends</Text>
                    <LineChart
                        data={lineData}
                        width={width - 40}
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: { borderRadius: 10 },
                            propsForDots: { r: '6', strokeWidth: '2', stroke: '#007aff' },
                        }}
                        bezier
                        style={{ borderRadius: 10 }}
                    />
                </View>
            </View>

            <View style={{ alignItems: 'center', marginBottom: 30 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Waste Distribution</Text>

                <ViewShot ref={chartRef} options={{ format: 'jpg', quality: 0.9 }}>
                    <PieChart
                        data={pieData}
                        width={width - 40}
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor={'population'}
                        backgroundColor={'transparent'}
                        paddingLeft={'15'}
                        absolute
                    />
                </ViewShot>

                <TouchableOpacity onPress={shareChart} style={{ backgroundColor: palette.primary.main, padding: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Iconify icon="material-symbols:share-outline" size={20} color="#fff" />
                    <Text style={{ color: '#fff', marginLeft: 8, fontSize: 16 }}>Share</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
