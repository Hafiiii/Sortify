import { useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
// @react-navigation
import { useFocusEffect } from '@react-navigation/native';
// firebase
import { firestore } from '../utils/firebase';
// components
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

export const getAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchUsers = async () => {
        try {
          const usersCollectionRef = collection(firestore, 'users');
          const usersSnapshot = await getDocs(usersCollectionRef);

          if (!usersSnapshot.empty) {
            const usersList = usersSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUsers(usersList);
          } else {
            Toast.show({ type: 'info', text1: 'No users found.' });
            setUsers([]);
          }
        } catch (error) {
          Toast.show({ type: 'error', text1: 'An error occurred while fetching all users.', text2: error.message || 'Please try again later.' });
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();

      return () => { };
    }, [])
  );

  return { users, loading, setUsers };
};
