import { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, SafeAreaView, Animated, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text, Chip, Button, Searchbar, Divider, RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
// firebase
import { firestore } from '../utils/firebase';
import { collection, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
// auth
import { useAuth } from '../context/AuthContext';
// components
import { Header } from '../components/Header/Header';
import { Picker } from '@react-native-picker/picker';
import { Iconify } from 'react-native-iconify';
import palette from '../theme/palette';
import moment from 'moment';
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

// ----------------------------------------------------------------------

export default function HistoryScreen() {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [wastes, setWastes] = useState([]);
    const [userData, setUserData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [sortOption, setSortOption] = useState('name-asc');
    const [loading, setLoading] = useState(true);
    const [FilterDrawer, setFilterDrawer] = useState(false);
    const [SortDrawer, setSortDrawer] = useState(false);
    const [scrollHeight, setScrollHeight] = useState(0);

    const [tempFilterRole, setTempFilterRole] = useState('');
    const [tempFilterDate, setTempFilterDate] = useState('');
    const [tempSortOption, setTempSortOption] = useState('name-asc');

    const sortAnim = useRef(new Animated.Value(height)).current;
    const slideAnim = useRef(new Animated.Value(-width)).current;

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.uid) {
                setLoading(false);
                return;
            }

            try {
                const userDocRef = doc(firestore, 'users', user.uid);
                const userSnapshot = await getDoc(userDocRef);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    setUserData(userData);
                } else {
                    setUserData(null);
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error fetching user data',
                });
                console.log('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.uid) {
            fetchUserData();
        }
    }, [user]);

    useEffect(() => {
        const fetchUserWastes = async () => {
            if (!userData?.userId) {
                return;
            }

            try {
                const wastesCollectionRef = collection(firestore, 'wastes');
                const q = query(wastesCollectionRef, where('userId', '==', userData.userId));
                const wastesSnapshot = await getDocs(q);

                if (!wastesSnapshot.empty) {
                    const wastesList = wastesSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setWastes(wastesList);
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'No waste data found for user.',
                    });
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'An error occurred while fetching wastes.',
                });
            }
        };

        if (userData) {
            fetchUserWastes();
        }
    }, [userData]);

    useEffect(() => {
        navigation.setOptions({
            tabBarStyle: SortDrawer || FilterDrawer
                ? { display: 'none' }
                : {
                    position: 'absolute',
                    bottom: 16,
                    left: 0,
                    right: 0,
                    borderRadius: 20,
                    height: 60,
                    backgroundColor: '#000',
                    marginHorizontal: 15,
                    paddingTop: 10,
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
                },
        });
    }, [SortDrawer, FilterDrawer, navigation]);


    const toggleFilter = () => {
        Animated.timing(slideAnim, {
            toValue: FilterDrawer ? -width : 0,
            duration: 300,
            useNativeDriver: true,
        }).start()
        setFilterDrawer(!FilterDrawer);
    };

    const toggleSort = () => {
        Animated.timing(sortAnim, {
            toValue: SortDrawer ? height : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setSortDrawer(!SortDrawer);
    };

    const applyFilters = () => {
        setFilterRole(tempFilterRole);
        setFilterDate(tempFilterDate);
        toggleFilter();
    };

    const cancelFilters = () => {
        setTempFilterRole(filterRole);
        setTempFilterDate(filterDate);
        toggleFilter();
    };

    const clearAllFilters = () => {
        setFilterRole('');
        setFilterDate('');
        setTempFilterRole('');
        setTempFilterDate('');
    };

    const now = new Date();
    const lastHour = moment().subtract(1, 'hour').toDate();
    const today = moment().startOf('day').toDate();
    const lastWeek = moment().subtract(7, 'days').startOf('day').toDate();
    const lastMonth = moment().subtract(1, 'month').startOf('day').toDate();
    const last3Months = moment().subtract(3, 'months').startOf('day').toDate();
    const lastYear = moment().subtract(1, 'year').startOf('day').toDate();

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
        { label: 'Waste Type (A-Z)', value: 'name-asc' },
        { label: 'Waste Type (Z-A)', value: 'name-desc' },
        { label: 'Date Added (Latest)', value: 'date-new' },
        { label: 'Date Added (Oldest)', value: 'date-old' }
    ];

    const filteredWastes = wastes
        .filter(waste =>
            `${waste.wasteName}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(waste => (filterRole ? waste.role === filterRole : true))
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

    if (loading) return <Text>Loading...</Text>;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={{ padding: 30 }}
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
                    style={{ borderRadius: 14, marginVertical: 20, height: 45, backgroundColor: '#eaeaea' }}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <TouchableOpacity
                        onPress={toggleFilter}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <Iconify icon="circum:filter" size={16} color="#000" />
                        <Text style={{ fontSize: 11, fontWeight: 700, marginLeft: 3 }}>FILTERS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={toggleSort}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{ fontSize: 12, fontWeight: 700, marginRight: 6 }}>Sort by</Text>
                        <Iconify icon="ri:arrow-down-s-line" size={17} color="#000" />
                    </TouchableOpacity>
                </View>

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
                    <View style={{ flex: 1, paddingBottom: 60 }}>
                        <ScrollView
                            style={{ padding: 20 }}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }}>
                                <Text style={{ fontSize: 18, fontWeight: 400 }}>Filter</Text>
                                <Iconify icon="material-symbols:close" size={20} color={palette.disabled.main} onPress={cancelFilters} />
                            </View>

                            <Divider style={{ alignSelf: 'stretch' }} />

                            <Text style={{ fontSize: 16, fontWeight: 700, marginVertical: 10 }}>Date Range</Text>
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
                                bottom: 0,
                                left: 0,
                                right: 0,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                backgroundColor: '#fff',
                                paddingHorizontal: 10,
                                paddingTop: 10,
                                paddingBottom: 35,
                                borderTopWidth: 1,
                                borderTopColor: palette.disabled.main,
                            }}
                        >
                            <Button
                                mode="outlined"
                                onPress={clearAllFilters}
                                style={{ flex: 1, marginRight: 5, borderRadius: 5, borderWidth: 1.5, color: '#000' }}
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
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: width,
                                height: height,
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                zIndex: 3,
                            }}
                        />
                    </TouchableWithoutFeedback>
                )}

                <Animated.View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: width,
                        height: height / 2,
                        backgroundColor: '#fff',
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        transform: [{ translateY: sortAnim }],
                        zIndex: 4,
                    }}
                >
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Iconify icon="ri:arrow-down-wide-fill" size={36} color="#eaeaea" />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 700 }}>Sort by</Text>
                        <TouchableOpacity mode="outlined" onPress={() => setSortOption('')}>
                            <Text style={{ textDecorationLine: 'underline' }}>Clear All</Text>
                        </TouchableOpacity>
                    </View>

                    <RadioButton.Group onValueChange={(newValue) => setSortOption(newValue)} value={sortOption}>
                        {sortOptions.map(({ label, value }) => (
                            <View key={value} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 7 }}>
                                <RadioButton value={value} />
                                <Text onPress={() => setSortOption(value)}>{label}</Text>
                            </View>
                        ))}
                    </RadioButton.Group>
                </Animated.View>

                {SortDrawer && (
                    <TouchableWithoutFeedback onPress={toggleSort}>
                        <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: width,
                                height: height,
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                zIndex: 3,
                            }}
                        />
                    </TouchableWithoutFeedback>
                )}

                {filteredWastes.length === 0 ? (
                    <Text>No waste found.</Text>
                ) : (
                    filteredWastes.map(waste => (
                        <View
                            key={waste.id}
                            style={{
                                height: 100,
                                borderRadius: 20,
                                marginVertical: 10,
                                boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)',
                                flexDirection: 'row',
                            }}
                        >
                            <Image
                                source={require("../../assets/recycling-value.png")}
                                style={{
                                    width: '25%',
                                    height: '100%',
                                    resizeMode: 'cover',
                                    borderTopLeftRadius: 20,
                                    borderBottomLeftRadius: 20,
                                }}
                            />
                            <View style={{ flexDirection: 'column', justifyContent: 'space-between', padding: 10, width: '75%', borderTopRightRadius: 20, borderBottomRightRadius: 20 }}>
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 16, fontWeight: 700 }}>{waste.wasteType}</Text>
                                        <View
                                            style={{
                                                backgroundColor: '#e5e5e5',
                                                paddingVertical: 5,
                                                paddingHorizontal: 8,
                                                borderRadius: 20,
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center', 
                                            }}
                                        >
                                            <Iconify icon="twemoji:coin" color={palette.primary.main} size={15} />
                                            <Text style={{ fontWeight: 700, fontSize: 12, marginLeft: 12 }}>{waste.point}</Text>
                                        </View>
                                    </View>

                                    <Text style={{ fontSize: 12 }}>{waste.wasteName}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: palette.disabled.main }}>
                                        {waste.dateAdded ? moment(waste.dateAdded.toDate()).format('DD-MM-YYYY hh.mmA') : 'N/A'}
                                    </Text>
                                    <Iconify icon="ic:outline-delete" color="#000" size={20} />
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView >
    );
}