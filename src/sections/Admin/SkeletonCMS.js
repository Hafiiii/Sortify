import { useState, useRef } from 'react';
import { View, Alert, ScrollView, SafeAreaView, Animated, Dimensions, TouchableOpacity, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { Text, Chip, Button, Searchbar, Divider, ActivityIndicator } from 'react-native-paper';
// firebase
import { firestore, storage } from '../../utils/firebase';
import { doc, deleteDoc, collection, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
// components
import { HeaderAdmin } from '../../components/Header/Header';
import { Iconify } from 'react-native-iconify';
import palette from '../../theme/palette';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import AdminList from '../../sections/Admin/AdminList';
import AddItemModal from './AddItemModal';

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

// ----------------------------------------------------------------------

export default function SkeletonCMS({
    hasDate,
    hasAdd,
    isArray,
    data,
    setData,
    loading,
    searchData,
    sortOptions,
    getSortFunction,
    title,
    listData,
    listArrayData,
    modalData,
    para,
    storageFileName
}) {
    const slideAnim = useRef(new Animated.Value(-width)).current;
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [tempFilterDate, setTempFilterDate] = useState('');
    const [FilterDrawer, setFilterDrawer] = useState(false);
    const [sortOption, setSortOption] = useState('date-new');
    const [scrollHeight, setScrollHeight] = useState(0);
    const [error, setError] = useState(null);
    const [loadingButton, setLoadingButton] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingItemId, setEditingItemId] = useState(null);

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

    const lastHour = hasDate ? moment().subtract(1, 'hour').toDate() : null;
    const today = hasDate ? moment().startOf('day').toDate() : null;
    const lastWeek = hasDate ? moment().subtract(7, 'days').startOf('day').toDate() : null;
    const lastMonth = hasDate ? moment().subtract(1, 'month').startOf('day').toDate() : null;
    const last3Months = hasDate ? moment().subtract(3, 'months').startOf('day').toDate() : null;
    const lastYear = hasDate ? moment().subtract(1, 'year').startOf('day').toDate() : null;

    const filteredItems = data
        .filter(item => {
            const text = searchData(item).toLowerCase();
            return text.includes(searchQuery.toLowerCase());
        })
        .filter(item => {
            if (!hasDate) return true;

            const rawDate = item.dateJoined || item.dateAdded;
            if (!rawDate) return true;

            const itemDate = rawDate.toDate();

            switch (filterDate) {
                case 'last-hour': return itemDate >= lastHour;
                case 'today': return itemDate >= today;
                case 'last-week': return itemDate >= lastWeek;
                case 'last-month': return itemDate >= lastMonth;
                case 'last-3-months': return itemDate >= last3Months;
                case 'last-year': return itemDate >= lastYear;
                default: return true;
            }
        })
        .sort(getSortFunction(sortOption));

    const onDelete = (id) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this item?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            const dataDocRef = doc(firestore, title, id);
                            const docSnap = await getDoc(dataDocRef);

                            if (docSnap.exists()) {
                                const data = docSnap.data();

                                if (data[para.fourth]) {
                                    const imageRef = ref(storage, data[para.fourth]);
                                    await deleteObject(imageRef);
                                }

                                await deleteDoc(dataDocRef);

                                setData(prevItems => prevItems.filter(item => item.id !== id));

                                Toast.show({
                                    type: 'success',
                                    text1: 'Item deleted successfully',
                                });
                            } else {
                                throw new Error('Document not found');
                            }
                        } catch (error) {
                            Toast.show({
                                type: 'error',
                                text1: 'Error deleting item',
                            });
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const handleAddItem = async (data) => {
        setLoadingButton(true);
        setError(null);

        try {
            const docRef = await addDoc(collection(firestore, title), {
                [para.first]: data[para.first],
                [para.second]: data[para.second],
                [para.third]: data[para.third],
                [para.fourth]: data[para.fourth],
                [para.fifth]: data[para.fifth],
                [para.sixth]: data[para.sixth],
            });

            const addedItem = {
                id: docRef.id,
                [para.first]: data[para.first],
                [para.second]: data[para.second],
                [para.third]: data[para.third],
                [para.fourth]: data[para.fourth],
                [para.fifth]: data[para.fifth],
                [para.sixth]: data[para.sixth],
            };

            setData(prev => [addedItem, ...prev]);

            setIsAddModalVisible(false);
            Toast.show({ type: 'success', text1: 'Item added successfully' });
        } catch (error) {
            console.error('Error adding item:', error);
            Toast.show({ type: 'error', text1: 'Error adding item' });
        }
        finally {
            setLoadingButton(false);
        }
    };

    const closeModal = () => {
        setIsAddModalVisible(false);
        setIsEditMode(false);
        setEditingItemId(null);
    };

    const handleUpdateItem = async (data) => {
        setLoadingButton(true);
        setError(null);

        try {
            await updateDoc(doc(firestore, title, editingItemId), {
                ...(para?.first && { [para.first]: data[para.first] }),
                ...(para?.second && { [para.second]: data[para.second] }),
                ...(para?.third && { [para.third]: data[para.third] }),
                ...(para?.fourth && { [para.fourth]: data[para.fourth] }),
                ...(para?.fifth && { [para.fifth]: data[para.fifth] }),
                ...(para?.sixth && { [para.sixth]: data[para.sixth] }),
                ...(para?.seventh && { [para.seventh]: data[para.seventh] }),
                ...(para?.eight && { [para.eight]: data[para.eight] }),
                ...(para?.ninth && { [para.ninth]: data[para.ninth] }),
            });

            setData(prevData =>
                prevData.map(item =>
                    item.id === editingItemId
                        ? { ...item, ...data }
                        : item
                )
            );

            Toast.show({ type: 'success', text1: 'Item updated successfully' });
            closeModal();
        } catch (error) {
            console.error('Error updating item:', error);
            Toast.show({ type: 'error', text1: 'Error updating item' });
        } finally {
            setLoadingButton(false);
        }
    };

    const handleEditItem = (item) => {
        setIsEditMode(true);
        setEditingItemId(item.id);
        setIsAddModalVisible(true);
    };

    const handleCancel = (item) => {
        setIsEditMode(true);
        setIsAddModalVisible(true);
    };

    if (loading || !data) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ImageBackground
            source={require('../../../assets/sortify-logo-half-bg.png')}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            resizeMode="cover"
            imageStyle={{ opacity: 0.4 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ padding: 30 }}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        setScrollHeight(contentHeight);
                    }}
                >
                    <HeaderAdmin title={title} />

                    <Searchbar
                        placeholder="Search"
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        icon={props => <Iconify icon="ri:search-line" size={20} />}
                        clearIcon={props => <Iconify icon="ic:baseline-clear" size={20} />}
                        inputStyle={{ color: '#000', height: 45, marginTop: -4 }}
                        style={{ borderRadius: 14, marginVertical: 10, height: 45, backgroundColor: '#eaeaea' }}
                    />

                    <View style={{ marginBottom: 5 }}>
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


                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                        {hasDate ? (
                            <TouchableOpacity
                                onPress={toggleFilter}
                                style={{ flexDirection: 'row', alignItems: 'center' }}
                            >
                                <Iconify icon="circum:filter" size={15} color="#000" />
                                <Text style={{ fontSize: 12, fontWeight: 700, marginLeft: 3 }}>FILTERS</Text>
                            </TouchableOpacity>
                        ) : (
                            <View />
                        )}

                        {hasAdd && (
                            <TouchableOpacity onPress={() => setIsAddModalVisible(true)} style={{ backgroundColor: palette.primary.main, paddingVertical: 7, paddingHorizontal: 15, borderRadius: 50 }}>
                                <Text style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>+ Add Item</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {hasDate && (
                        <>
                            <Animated.View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    width: width - 60,
                                    height: height - 20,
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
                        </>
                    )}

                    {filteredItems.length === 0 ? (
                        <Text>No item found.</Text>
                    ) : (
                        filteredItems.map(data => (
                            <AdminList
                                key={data.id}
                                data={isArray ? listArrayData(data) : listData(data)}
                                modal={modalData}
                                onEdit={() => handleEditItem(data)}
                                onDelete={() => onDelete(data.id)}
                                isArray={isArray}
                            />
                        ))
                    )}

                    {/* <AddItemModal
                        isVisible={isAddModalVisible}
                        onClose={() => {
                            setIsAddModalVisible(false);
                            setIsEditMode(false);
                        }}
                        onSubmit={isEditMode ? handleUpdateItem : handleAddItem}
                        para={para}
                        loadingButton={loadingButton}
                        isEditMode={isEditMode}
                        title={title}
                        docId={editingItemId}
                        storageFileName={storageFileName}
                    /> */}
                </ScrollView>
            </SafeAreaView >
        </ImageBackground>
    );
}