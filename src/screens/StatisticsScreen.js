import { useState, useEffect, useRef } from 'react';
import { View, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Chip } from 'react-native-paper';
// hooks
import { getWastes } from '../hooks/getWastes';
// chart
import { PieChart, LineChart } from 'react-native-chart-kit';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import ViewShot from 'react-native-view-shot';
// components
import Share from 'react-native-share';
import { Iconify } from 'react-native-iconify';
import palette from '../theme/palette';
import { HeaderTriple } from '../components/Header/Header';
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// ----------------------------------------------------------------------

export default function StatisticsScreen() {
    const { wasteData } = getWastes();
    const chartRef = useRef(null);
    const [selectedFilter, setSelectedFilter] = useState('Weekly');
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const getWeekDates = (date) =>
        Array.from({ length: 7 }, (_, i) =>
            dayjs(date).startOf('week').add(i, 'day').format('YYYY-MM-DD')
        );

    const [weekDates, setWeekDates] = useState(getWeekDates(selectedDate));

    useEffect(() => {
        setWeekDates(getWeekDates(selectedDate));
    }, [selectedDate]);

    const changeDate = (direction) => {
        const newDate =
            selectedFilter === 'Weekly'
                ? dayjs(selectedDate).add(direction, 'week')
                : selectedFilter === 'Monthly'
                    ? dayjs(selectedDate).add(direction, 'month')
                    : dayjs(selectedDate).add(direction, 'year');

        setSelectedDate(newDate);
    };

    const generateData = () => {
        const dateFormat = selectedFilter === 'Weekly' ? 'YYYY-MM-DD' : 'YYYY-MM';
        let dateRange = [];

        if (selectedFilter === 'Weekly') {
            dateRange = getWeekDates(selectedDate);
        } else if (selectedFilter === 'Monthly') {
            dateRange = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        } else if (selectedFilter === 'Yearly') {
            const currentYear = dayjs().year();
            dateRange = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
        }

        const labels = dateRange.map((dateLabel) => {
            if (selectedFilter === 'Weekly') {
                return dayjs(dateLabel).format('D');
            } else {
                return dateLabel;
            }
        });

        const data = dateRange.map((dateLabel) => {
            let count = 0;

            wasteData.forEach((item) => {
                const itemTimestamp = item.dateAdded.seconds * 1000 + item.dateAdded.nanoseconds / 1000000;
                const itemDate = dayjs(itemTimestamp);

                let formattedDate = '';

                if (selectedFilter === 'Weekly') {
                    formattedDate = dayjs(dateLabel).format('YYYY-MM-DD');
                } else if (selectedFilter === 'Monthly') {
                    const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(dateLabel);
                    formattedDate = itemDate.format('YYYY-MM') === dayjs().month(monthIndex).format('YYYY-MM') ? dayjs().month(monthIndex).format('YYYY-MM') : '';
                } else {
                    formattedDate = String(dateLabel);
                }

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
            Toast.show({ type: 'error', text1: 'A problem occured', text2: error.message || 'Please contact support.' });
        }
    };

    const generateRainbowPastelColors = (count) => {
        return Array.from({ length: count }, (_, i) => {
            const hue = Math.floor((360 / count) * i);
            return `hsl(${hue}, 70%, 70%)`;
        });
    };

    const wasteTypesMap = new Map();

    wasteData.forEach((item) => {
        const types = Array.isArray(item.wasteType) ? item.wasteType : [item.wasteType];
        const amount = item.amount || 1;

        types.forEach((type) => {
            if (!wasteTypesMap.has(type)) {
                wasteTypesMap.set(type, { type, total: 0 });
            }
            wasteTypesMap.get(type).total += amount;
        });
    });

    const wasteTypes = Array.from(wasteTypesMap.values());

    const pieData = wasteTypes.map((entry, i) => ({
        name: entry.type,
        population: entry.total,
        color: generateRainbowPastelColors(wasteTypes.length)[i],
    }));

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: '#fff', paddingBottom: 185 }}>
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
                                <View key={index} style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ borderRadius: 100, paddingHorizontal: 5 }}>
                                        {dayjs(date).format('D')}
                                    </Text>
                                    <Text style={{ paddingHorizontal: 5, fontSize: 11 }}>
                                        {dayjs(date).format('MMM')}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity onPress={() => changeDate(1)} style={{ padding: 10 }}>
                            <Iconify icon="ri:arrow-right-s-line" size={24} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={{ alignItems: 'center' }}>
                <View style={{ position: 'relative', width: width, height: 200 }}>
                    <ViewShot ref={chartRef} options={{ format: 'jpg', quality: 0.9 }}>
                        <PieChart
                            data={pieData}
                            width={width - 40}
                            height={200}
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
