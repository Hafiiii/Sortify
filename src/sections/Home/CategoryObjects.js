import { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
// @react-navigation
import { useRoute, useNavigation } from '@react-navigation/native';
// hooks
import { getObjects } from '../../hooks/getObjects';
// components
import { Iconify } from 'react-native-iconify';
import palette from '../../theme/palette';
import { HeaderTriple } from '../../components/Header/Header';

// ----------------------------------------------------------------------

export default function CategoryObjects() {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId, categoryName } = route.params;
  const { objects } = getObjects();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredObjects = objects
    .filter((obj) => obj.categoryId?.includes(categoryId))
    .sort((a, b) => a.objName.localeCompare(b.objName))
    .filter(obj =>
      `${obj.objName}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
    ;

  return (
    <View style={{ padding: 30, backgroundColor: '#fff' }}>

      <HeaderTriple title={categoryName} style={{ fontWeight: 700, fontSize: 18 }} />

      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        icon={props => <Iconify icon="ri:search-line" size={20} />}
        clearIcon={props => <Iconify icon="ic:baseline-clear" size={20} />}
        inputStyle={{ color: '#000', height: 45, marginTop: -4 }}
        style={{ borderRadius: 14, marginTop: 10, marginBottom: 16, height: 45, backgroundColor: '#eaeaea' }}
      />

      <FlatList
        data={filteredObjects}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 175 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ObjectDetail', {
                objName: item.objName,
                categoryId: item.categoryId,
              })
            }
            style={{
              padding: 10,
              borderRadius: 5,
              marginVertical: 3,
              boxShadow: '0 2px 3px rgba(0, 0, 0, 0.3)',
              backgroundColor: palette.primary.main,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 700 }}>{item.objName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
