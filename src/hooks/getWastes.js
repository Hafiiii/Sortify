import { useState, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
// @react-navigation
import { useFocusEffect } from '@react-navigation/native';
// firebase
import { firestore } from '../utils/firebase';
// auth
import { useAuth } from '../context/AuthContext';
// components
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

export const getWastes = () => {
  const { user } = useAuth();
  const [wasteData, setWasteData] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchWasteData = async () => {
        if (!user?.uid) {
          setLoading(false);
          return;
        }

        try {
          const wastesCollectionRef = collection(firestore, 'wastes');
          const q = query(wastesCollectionRef, where('uid', '==', user.uid));
          const wastesSnapshot = await getDocs(q);

          if (!wastesSnapshot.empty) {
            const wastesList = wastesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setWasteData(wastesList);
          } else {
            Toast.show({ type: 'error', text1: "Oops! You haven't scanned any waste item yet.", text2: error.message || 'Please try again later.' });
            setWasteData([]);
          }
        } catch (error) {
          Toast.show({ type: 'error', text1: 'An error occurred while fetching wastes.', text2: error.message || 'Please try again later.' });
        } finally {
          setLoading(false);
        }
      };

      fetchWasteData();

      return () => { };
    }, [user?.uid])
  );

  return { wasteData, loading, setWasteData };
};
