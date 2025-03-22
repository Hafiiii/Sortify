import { View, Text, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function ProfileScreen() {
  const route = useRoute();
  const { userData } = route.params; // Get user data from navigation

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Image 
        source={{ uri: userData.profileImage || 'https://via.placeholder.com/150' }} 
        style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
      />
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{userData.name}</Text>
      <Text style={{ fontSize: 16 }}>{userData.email}</Text>
    </View>
  );
}
