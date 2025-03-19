import React from 'react';
import { View, Text} from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{    flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        paddingHorizontal: 20,}}>
      <Text style={{    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#4CAF50', }}>Waste Sorting App</Text>
    </View>
  );
};