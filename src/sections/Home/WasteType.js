import { View, FlatList, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
// @rect-navigation
import { useNavigation } from '@react-navigation/native';

// ----------------------------------------------------------------------

const BOX_SIZE = 110;

// ----------------------------------------------------------------------

export default function WasteType({ categories }) {
    const navigation = useNavigation();

    const renderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
                navigation.navigate('CategoryObjects', {
                    categoryId: item.categoryId,
                    categoryName: item.categoryName,
                })
            }
        >
            <View
                style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: 20,
                    marginRight: 5,
                    width: BOX_SIZE,
                    height: BOX_SIZE,
                    overflow: 'hidden',
                }}
            >
                <ImageBackground
                    source={{ uri: item.categoryURL }}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    imageStyle={{ borderRadius: 25 }}
                >
                    <View style={{ width: '100%' }}>
                        <Text
                            style={{
                                paddingVertical: 5,
                                textAlign: 'center',
                                color: '#fff',
                                fontWeight: '700',
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            }}
                        >
                            {item.categoryName}
                        </Text>
                    </View>
                </ImageBackground>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ paddingHorizontal: 30, paddingVertical: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: 700, marginBottom: 5 }}>Explore Waste Type</Text>

            <FlatList
                data={categories.slice(0, 10)}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                contentContainerStyle={{ paddingVertical: 10 }}
            />
        </View>
    );
}