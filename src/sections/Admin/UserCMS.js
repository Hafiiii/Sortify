import { useState, useRef } from 'react';
import { View, Alert, ScrollView, SafeAreaView, Animated, Dimensions, TouchableOpacity, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { Text, Chip, Button, Searchbar, Divider } from 'react-native-paper';
// hooks
import { getAllUsers } from '../../hooks/getAllUsers';
// firebase
import { firestore } from '../../utils/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
// components
import { Header } from '../../components/Header/Header';
import { Iconify } from 'react-native-iconify';
import palette from '../../theme/palette';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import AdminList from '../../sections/Admin/AdminList';

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
    { label: 'Date Joined (Latest)', value: 'date-new' },
    { label: 'Date Joined (Oldest)', value: 'date-old' },
    { label: 'Waste Type (A-Z)', value: 'name-asc' },
    { label: 'Waste Type (Z-A)', value: 'name-desc' },
];

// ----------------------------------------------------------------------

export default function UserCMS() {
    const slideAnim = useRef(new Animated.Value(-width)).current;
    const { users, loading } = getAllUsers();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [tempFilterDate, setTempFilterDate] = useState('');
    const [FilterDrawer, setFilterDrawer] = useState(false);
    const [sortOption, setSortOption] = useState('date-new');
    const [scrollHeight, setScrollHeight] = useState(0);

    console.log('Users:', users);

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

    const lastHour = moment().subtract(1, 'hour').toDate();
    const today = moment().startOf('day').toDate();
    const lastWeek = moment().subtract(7, 'days').startOf('day').toDate();
    const lastMonth = moment().subtract(1, 'month').startOf('day').toDate();
    const last3Months = moment().subtract(3, 'months').startOf('day').toDate();
    const lastYear = moment().subtract(1, 'year').startOf('day').toDate();

    const filteredUsers = users
        .filter(user =>
            `${user.firstName}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(user => {
            if (!user.dateJoined) return true;
            const userDate = user.dateJoined.toDate();

            switch (filterDate) {
                case 'last-hour': return userDate >= lastHour;
                case 'today': return userDate >= today;
                case 'last-week': return userDate >= lastWeek;
                case 'last-month': return userDate >= lastMonth;
                case 'last-3-months': return userDate >= last3Months;
                case 'last-year': return userDate >= lastYear;
                default: return true;
            }
        })
        .sort((a, b) => {
            if (sortOption === 'name-asc') return a.firstName.localeCompare(b.firstName);
            if (sortOption === 'name-desc') return b.firstName.localeCompare(a.firstName);
            if (sortOption === 'date-new') return b.dateJoined.toDate() - a.dateJoined.toDate();
            if (sortOption === 'date-old') return a.dateJoined.toDate() - b.dateJoined.toDate();
            return 0;
        });

    const onDelete = (id) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this user item?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            const userDocRef = doc(firestore, 'users', id);
                            await deleteDoc(userDocRef);
                            setUserData(prevUsers => prevUsers.filter(user => user.id !== id));
                            Toast.show({
                                type: 'success',
                                text1: 'User deleted successfully',
                            });
                        } catch (error) {
                            Toast.show({
                                type: 'error',
                                text1: 'Error deleting user item',
                            });
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    if (loading) return <Text>Loading...</Text>;

    return (
        <ImageBackground
            source={require('../../../assets/sortify-logo-half-bg.png')}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            resizeMode="cover"
            imageStyle={{ opacity: 0.4 }}
        >
            <SafeAreaView style={{ flex: 1, marginBottom: 60 }}>
                <ScrollView
                    contentContainerStyle={{ padding: 30 }}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        setScrollHeight(contentHeight);
                    }}
                >
                    <Header title="Users" style={{ fontWeight: 700 }} />

                    <Searchbar
                        placeholder="Search"
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        icon={props => <Iconify icon="ri:search-line" size={20} />}
                        clearIcon={props => <Iconify icon="ic:baseline-clear" size={20} />}
                        inputStyle={{ color: '#000', height: 45, marginTop: -4 }}
                        style={{ borderRadius: 14, marginVertical: 10, height: 45, backgroundColor: '#eaeaea' }}
                    />

                    <View style={{ marginBottom: 10 }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {sortOptions.map((option) => (
                                <Chip
                                    key={option.value}
                                    selected={sortOption === option.value}
                                    onPress={() => setSortOption(option.value)}
                                    showSelectedCheck={false}
                                    style={{
                                        marginRight: 5,
                                        marginBottom: 8,
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

                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            width: width - 60,
                            height: height - 120,
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
                                    padding: 10,
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

                    {filteredUsers.length === 0 ? (
                        <Text>No user found.</Text>
                    ) : (
                        filteredUsers.map(data => (
                            <AdminList
                                key={data.id}
                                data={{
                                    first: data.firstName,
                                    second: data.lastName,
                                    points: data.totalPoints,
                                    id: data.userId,
                                    date: data.dateJoined,
                                    image: data.photoURL,
                                    third: data.email,
                                    fourth: data.phoneNumber,
                                    fifth: data.gender,
                                    sixth: data.birthday,
                                    seventh: data.totalWaste,
                                }}
                                onDelete={onDelete}
                            />
                        ))
                    )}
                </ScrollView>
            </SafeAreaView >
        </ImageBackground>
    );
}