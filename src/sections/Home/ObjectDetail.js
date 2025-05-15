import { View, ScrollView, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
// @react-navigation
import { useRoute } from '@react-navigation/native';
// hooks
import { getObjectByObjName } from '../../hooks/getObjectByObjName';
import { getCategoryByCategoryId } from '../../hooks/getCategoryByCategoryId';
// components
import palette from '../../theme/palette';
import { HeaderTriple } from '../../components/Header/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('screen');

// ----------------------------------------------------------------------

export default function ObjectDetailScreen() {
    const route = useRoute();
    const { objName, categoryId } = route.params;
    const { category } = getCategoryByCategoryId(categoryId);
    const { object } = getObjectByObjName(objName);

    return (
        <View
            style={{
                flex: 1,
                width: width,
                height: height,
                justifyContent: 'space-between',
                backgroundColor: '#fff',
            }}
        >
            <View style={{ paddingHorizontal: 30, paddingVertical: 20 }}>
                <HeaderTriple title={objName} style={{ fontWeight: 700, fontSize: 18 }} />
            </View>

            <View
                style={{
                    backgroundColor: palette.primary.main,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 35,
                    paddingBottom: 70,
                    flex: 1
                }}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {category?.map((cat, index) => (
                        <View
                            key={index}
                            style={{
                                marginBottom: 15,
                                backgroundColor: '#fff',
                                padding: 15,
                                borderRadius: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <Icon name={cat.categoryIcon} size={60} color="#000" />

                            <View style={{ width: '80%', flexDirection: 'column', gap: 8 }}>
                                <Text style={{ fontSize: 16, fontWeight: 700 }}>{cat.categoryName}</Text>

                                {object?.map((obj, index) => (
                                    <Text key={index} style={{ textAlign: 'justify' }}>{obj.categoryDesc}</Text>
                                ))}

                                <Text style={{ color: palette.disabled.secondary, textAlign: 'justify' }}>
                                    Recycle Info: {cat.categoryRecycle}
                                </Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                                    <View style={{ backgroundColor: cat.isRecyclables ? 'red' : 'green', width: 8, height: 8, borderRadius: 50 }} />

                                    <Text style={{ color: cat.isRecyclables ? 'red' : 'green', fontWeight: 700 }}>
                                        {cat.isRecyclables ? 'Not Recyclable' : 'Recyclable'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
