import { useState, useRef } from 'react';
import { View, Alert, ScrollView, Animated, Dimensions, TouchableOpacity, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { Text, Chip, Button, Searchbar, Divider } from 'react-native-paper';
// hooks
import { getWastes } from '../hooks/getWastes';
// firebase
import { firestore, storage } from '../utils/firebase';
import { doc, deleteDoc, getDoc, collection, getDocs, where, query } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
// components
import { Header } from '../components/Header/Header';
import { Iconify } from 'react-native-iconify';
import palette from '../theme/palette';
import dayjs from 'dayjs';
import Toast from 'react-native-toast-message';
import HistoryList from '../sections/History/HistoryList';
import LoadingIndicator from '../components/Animated/LoadingIndicator';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

const dateOptions = [
    { label: 'All Time', value: '' },
    { label: 'Last Hour', value: 'last-hour' },
    { label: 'Today', value: 'today' },
    { label: 'Last Week', value: 'last-week' },
    { label: 'Last Month', value: 'last-month' },
    { label: 'Last 3 Months', value: 'last-3-months' },
    { label: 'Last Year', value: 'last-year' }
];

const sortOptions = [
    { label: 'Date Added (Latest)', value: 'date-new' },
    { label: 'Date Added (Oldest)', value: 'date-old' },
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
];

// ----------------------------------------------------------------------

export default function HistoryScreen() {
    const slideAnim = useRef(new Animated.Value(-width)).current;
    const { wasteData, setWasteData, loading } = getWastes();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [tempFilterDate, setTempFilterDate] = useState('');
    const [FilterDrawer, setFilterDrawer] = useState(false);
    const [sortOption, setSortOption] = useState('date-new');
    const [scrollHeight, setScrollHeight] = useState(0);

    const toggleFilter = () => {
        Animated.timing(slideAnim, {
            toValue: FilterDrawer ? -width : 0,
            duration: 300,
            useNativeDriver: true,
        }).start()
        setFilterDrawer(!FilterDrawer);
    };

    const applyFilters = () => {
        setFilterDate(tempFilterDate);
        toggleFilter();
    };

    const cancelFilters = () => {
        setTempFilterDate(filterDate);
        toggleFilter();
    };

    const clearAllFilters = () => {
        setFilterDate('');
        setTempFilterDate('');
    };

    const lastHour = dayjs().subtract(1, 'hour').toDate();
    const today = dayjs().startOf('day').toDate();
    const lastWeek = dayjs().subtract(7, 'day').startOf('day').toDate();
    const lastMonth = dayjs().subtract(1, 'month').startOf('day').toDate();
    const last3Months = dayjs().subtract(3, 'month').startOf('day').toDate();
    const lastYear = dayjs().subtract(1, 'year').startOf('day').toDate();

    const filteredWastes = wasteData
        .filter(waste =>
            `${waste.wasteName} ${waste.wasteType}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(waste => {
            if (!waste.dateAdded) return true;
            const wasteDate = waste.dateAdded.toDate();

            switch (filterDate) {
                case 'last-hour': return wasteDate >= lastHour;
                case 'today': return wasteDate >= today;
                case 'last-week': return wasteDate >= lastWeek;
                case 'last-month': return wasteDate >= lastMonth;
                case 'last-3-months': return wasteDate >= last3Months;
                case 'last-year': return wasteDate >= lastYear;
                default: return true;
            }
        })
        .sort((a, b) => {
            if (sortOption === 'name-asc') return a.wasteName.localeCompare(b.wasteName);
            if (sortOption === 'name-desc') return b.wasteName.localeCompare(a.wasteName);
            if (sortOption === 'date-new') return b.dateAdded.toDate() - a.dateAdded.toDate();
            if (sortOption === 'date-old') return a.dateAdded.toDate() - b.dateAdded.toDate();
            return 0;
        });

    const onDelete = (id) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this waste item?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            const dataDocRef = doc(firestore, 'wastes', id);
                            const docSnap = await getDoc(dataDocRef);

                            if (!docSnap.exists()) throw new Error('Document not found');

                            const data = docSnap.data();
                            const photoURL = data.photoURL;

                            await deleteDoc(dataDocRef);

                            setWasteData(prevWastes => prevWastes.filter(waste => waste.id !== id));

                            const wastesRef = collection(firestore, 'wastes');
                            const q = query(wastesRef, where('photoURL', '==', photoURL));
                            const snapshot = await getDocs(q);

                            if (snapshot.empty && photoURL) {
                                const imageRef = ref(storage, photoURL);
                                await deleteObject(imageRef);
                            }

                            Toast.show({ type: 'success', text1: 'Waste item deleted successfully' });
                        } catch (error) {
                            Toast.show({ type: 'error', text1: 'Error deleting waste item', text2: error.message || 'Please try again later.' });
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    if (loading || !wasteData) return <LoadingIndicator />

    return (
        <ImageBackground
            source={require('../../assets/sortify-logo-half-bg.webp')}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            resizeMode="cover"
            imageStyle={{ opacity: 0.4 }}
        >
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 30, paddingVertical: 10, paddingBottom: 80 }}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        setScrollHeight(contentHeight);
                    }}
                >
                    <Header title="History" style={{ fontWeight: 700 }} />

                    <Searchbar
                        placeholder="Search"
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        icon={props => <Iconify icon="ri:search-line" size={20} />}
                        clearIcon={props => <Iconify icon="ic:baseline-clear" size={20} />}
                        inputStyle={{ color: '#000', height: 45, marginTop: -4 }}
                        style={{ borderRadius: 14, marginVertical: 7, height: 45, backgroundColor: '#eaeaea' }}
                    />

                    <View style={{ marginBottom: 15 }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {sortOptions.map((option) => (
                                <Chip
                                    key={option.value}
                                    selected={sortOption === option.value}
                                    onPress={() => setSortOption(option.value)}
                                    showSelectedCheck={false}
                                    style={{
                                        marginRight: 5,
                                        backgroundColor: sortOption === option.value ? palette.primary.main : '#eaeaea',
                                        borderRadius: 20,
                                    }}
                                    textStyle={{
                                        color: sortOption === option.value ? '#fff' : '#000',
                                        fontSize: 12,
                                        fontWeight: 700,
                                    }}
                                >
                                    {option.label}
                                </Chip>
                            ))}
                        </ScrollView>
                    </View>

                    <TouchableOpacity
                        onPress={toggleFilter}
                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}
                    >
                        <Iconify icon="circum:filter" size={16} color="#000" />
                        <Text style={{ fontSize: 11, fontWeight: 700, marginLeft: 3 }}>FILTERS</Text>
                    </TouchableOpacity>

                    {filteredWastes.length === 0 ? (
                        <Text>No waste found.</Text>
                    ) : (
                        filteredWastes.map(waste => (
                            <HistoryList key={waste.id} waste={waste} onDelete={onDelete} />
                        ))
                    )}
                </ScrollView>
            </View >

            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: width - 60,
                    height: height,
                    backgroundColor: '#fff',
                    transform: [{ translateX: slideAnim }],
                    zIndex: 4,
                }}
            >
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 16, marginTop: 3 }}>Filter</Text>
                            <Iconify icon="material-symbols:close" size={20} color={palette.disabled.main} onPress={cancelFilters} />
                        </View>

                        <Divider style={{ alignSelf: 'stretch' }} />

                        <Text style={{ fontWeight: 700, marginVertical: 8 }}>Date Range</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                            {dateOptions.map(({ label, value }) => (
                                <Chip
                                    key={value}
                                    mode="outlined"
                                    onPress={() => setTempFilterDate(value)}
                                    style={{
                                        backgroundColor: tempFilterDate === value ? '#000' : '#fff',
                                        borderColor: tempFilterDate === value ? '#000' : palette.disabled.main,
                                    }}
                                    textStyle={{
                                        color: tempFilterDate === value ? '#fff' : palette.disabled.secondary,
                                    }}
                                >
                                    {label}
                                </Chip>
                            ))}
                        </View>
                    </ScrollView>

                    <View
                        style={{
                            position: 'absolute',
                            bottom: 74,
                            left: 0,
                            right: 0,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            backgroundColor: '#fff',
                            padding: 10,
                            borderTopWidth: 0.5,
                            borderTopColor: palette.disabled.main,
                        }}
                    >
                        <Button
                            mode="outlined"
                            onPress={clearAllFilters}
                            style={{ flex: 1, marginRight: 5, borderRadius: 5, borderWidth: 1, color: '#000' }}
                            labelStyle={{ color: '#000' }}
                            theme={{ colors: { primary: '#000' } }}
                        >
                            Clear All
                        </Button>

                        <Button
                            mode="contained"
                            onPress={applyFilters}
                            style={{ flex: 1, backgroundColor: '#000', borderRadius: 5 }}
                        >
                            Apply
                        </Button>
                    </View>
                </View>
            </Animated.View>

            {FilterDrawer && (
                <TouchableWithoutFeedback onPress={toggleFilter}>
                    <View
                        style={{
                            flex: 1,
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: width,
                            height: height,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            zIndex: 3,
                        }}
                    />
                </TouchableWithoutFeedback>
            )}
        </ImageBackground>
    );
}