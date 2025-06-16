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
import LoadingIndicator from '../../components/Animated/LoadingIndicator';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

// ----------------------------------------------------------------------

export default function ObjectDetailScreen() {
    const route = useRoute();
    const { objName, categoryId } = route.params;
    const { category } = getCategoryByCategoryId(categoryId);
    const { object, loading } = getObjectByObjName(objName);
    const currentObject = object?.[0];

    if (loading) return <LoadingIndicator />;

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
            <View style={{ paddingHorizontal: 30, paddingVertical: 10 }}>
                <HeaderTriple title={objName} style={{ fontWeight: 700, fontSize: 18 }} />
            </View>

            <View
                style={{
                    backgroundColor: palette.primary.main,
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    alignItems: 'center',
                    padding: 15,
                    paddingBottom: 74,
                    flex: 1
                }}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {currentObject?.categoryId?.map((id, index) => {
                        const matchedCategory = category?.find(cat => String(cat.categoryId) === String(id));
                        const desc = currentObject.categoryDesc?.[index];

                          console.log(categoryId);

                        if (!matchedCategory) return null;

                        return (
                            <View
                                key={id}
                                style={{
                                    marginBottom: 7,
                                    backgroundColor: '#fff',
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                    borderRadius: 22,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    gap: 6,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Icon name={matchedCategory.categoryIcon} size={35} color="#000" />
                                    <Text style={{ fontSize: 16, fontWeight: '700' }}>{matchedCategory.categoryName}</Text>
                                </View>

                                <Text style={{ textAlign: 'justify', lineHeight: 20 }}>{desc}</Text>

                                <Text style={{ color: palette.disabled.secondary, textAlign: 'justify', lineHeight: 20 }}>
                                    Recycle Info: {matchedCategory.categoryRecycle}
                                </Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                                    <View
                                        style={{
                                            backgroundColor: matchedCategory.isRecyclable ? 'green' : 'red',
                                            width: 8,
                                            height: 8,
                                            borderRadius: 50,
                                        }}
                                    />
                                    <Text style={{ color: matchedCategory.isRecyclable ? 'green' : 'red', fontWeight: '700' }}>
                                        {matchedCategory.isRecyclable ? 'Recyclable' : 'Not Recyclable'}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
}