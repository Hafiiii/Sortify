import { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, SafeAreaView, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Chip, Button, Searchbar, Icon } from 'react-native-paper';
// firebase
import { firestore } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
// components
import Header from '../components/Header/Header';
import { Picker } from '@react-native-picker/picker';
import { Iconify } from 'react-native-iconify';
import palette from '../theme/palette';
import moment from 'moment';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('screen');

// ----------------------------------------------------------------------

export default function HistoryScreen() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [sortOption, setSortOption] = useState('name-asc');
    const [loading, setLoading] = useState(true);
    const [FilterDrawer, setFilterDrawer] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);


    const [tempFilterRole, setTempFilterRole] = useState('');
    const [tempFilterDate, setTempFilterDate] = useState('');
    const [tempSortOption, setTempSortOption] = useState('name-asc');

    const sortAnim = useRef(new Animated.Value(-300)).current;
    const slideAnim = useRef(new Animated.Value(-300)).current;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollectionRef = collection(firestore, 'users');
                const usersSnapshot = await getDocs(usersCollectionRef);
                const usersList = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersList);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const toggleFilter = () => {
        Animated.timing(slideAnim, {
            toValue: FilterDrawer ? -300 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setFilterDrawer(!FilterDrawer);
    };

    const toggleSort = () => {
        Animated.timing(sortAnim, {
            toValue: isSortOpen ? -300 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setIsSortOpen(!isSortOpen);
    };

    // Apply Filters
    const applyFilters = () => {
        setFilterRole(tempFilterRole);
        setFilterDate(tempFilterDate);
        toggleFilter();
    };

    // Cancel Filters
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
        { label: 'Name (A-Z)', value: 'name-asc' },
        { label: 'Name (Z-A)', value: 'name-desc' },
        { label: 'Newest First', value: 'date-new' },
        { label: 'Oldest First', value: 'date-old' }
    ];

    const filteredUsers = users
        .filter(user =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(user => (filterRole ? user.role === filterRole : true))
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

    if (loading) return <Text>Loading...</Text>;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 30 }} showsVerticalScrollIndicator={false}>
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

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={toggleFilter}
                        style={{
                            marginBottom: 10,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <Iconify icon="circum:filter" size={16} color="#000" />
                        <Text style={{ fontSize: 10, fontWeight: 700, marginLeft: 3 }}>FILTERS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={toggleSort}
                        style={{
                            marginBottom: 10,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', marginRight: 7 }}>Sort by</Text>
                        <Iconify icon="ri:arrow-down-s-line" size={16} color="#000" />
                    </TouchableOpacity>
                </View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 250,
                        height: height,
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        transform: [{ translateX: slideAnim }],
                        zIndex: 4,
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Filters</Text>

                    {/* 🔹 Filter by Role */}
                    <Picker selectedValue={tempFilterRole} onValueChange={setTempFilterRole} style={{ marginBottom: 10 }}>
                        <Picker.Item label="All Roles" value="" />
                        <Picker.Item label="Admin" value="admin" />
                        <Picker.Item label="User" value="user" />
                    </Picker>

                    {/* 🔹 Date Filter Chips */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                        {dateOptions.map(({ label, value }) => (
                            <Chip
                                key={value}
                                mode="outlined"
                                onPress={() => setTempFilterDate(value)}
                                style={{
                                    backgroundColor: tempFilterDate === value ? palette.primary.main : 'white',
                                    borderColor: palette.primary.main,
                                }}
                                textStyle={{
                                    color: tempFilterDate === value ? 'white' : palette.primary.main,
                                }}
                            >
                                {label}
                            </Chip>
                        ))}
                    </View>

                    {/* 🔹 Apply & Cancel Buttons */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <Button mode="outlined" onPress={clearAllFilters} style={{ flex: 1, marginRight: 5 }}>
                            Clear All
                        </Button>
                        <Button mode="outlined" onPress={cancelFilters} style={{ flex: 1, marginRight: 5 }}>
                            Cancel
                        </Button>
                        <Button mode="contained" onPress={applyFilters} style={{ flex: 1 }}>
                            Apply
                        </Button>
                    </View>
                </Animated.View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 100,
                        left: 0,
                        width: 250,
                        height: '100%',
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        transform: [{ translateX: sortAnim }],
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Sort By</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                        {sortOptions.map(({ label, value }) => (
                            <Chip key={value} mode="outlined" onPress={() => setSortOption(value)} selected={sortOption === value}>
                                {label}
                            </Chip>
                        ))}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button mode="outlined" onPress={() => setSortOption('')}>Clear All</Button>
                        <Button mode="contained" onPress={toggleSort}>Apply</Button>
                    </View>
                </Animated.View>

                {filteredUsers.length === 0 ? (
                    <Text>No users found.</Text>
                ) : (
                    filteredUsers.map(user => (
                        <View
                            key={user.id}
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
                                        <Text style={{ fontSize: 16, fontWeight: 700 }}>{user.lastName}</Text>
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
                                            <Text style={{ fontWeight: 700, fontSize: 12, marginLeft: 12 }}>{user.userId}</Text>
                                        </View>
                                    </View>

                                    <Text style={{ fontSize: 12 }}>{user.firstName}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: palette.disabled.main }}>
                                        {user.dateJoined ? moment(user.dateJoined.toDate()).format('DD-MM-YYYY hh.mmA') : 'N/A'}
                                    </Text>
                                    <Iconify icon="ic:outline-delete" color="#000" size={20} />
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}