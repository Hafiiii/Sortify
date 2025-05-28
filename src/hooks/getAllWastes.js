import { useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
// @react-navigation
import { useFocusEffect } from '@react-navigation/native';
// firebase
import { firestore } from '../utils/firebase';
// components
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

export const getAllWastes = () => {
  const [wastes, setWastes] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchWasteData = async () => {
        try {
          const wastesCollectionRef = collection(firestore, 'wastes');
          const wastesSnapshot = await getDocs(wastesCollectionRef);

          if (!wastesSnapshot.empty) {
            const wastesList = wastesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setWastes(wastesList);
          } else {
            Toast.show({ type: 'info', text1: 'No waste items found.' });
            setWastes([]);
          }
        } catch (error) {
          Toast.show({ type: 'error', text1: 'An error occurred while fetching all wastes.', text2: error.message || 'Please try again later.' });
        } finally {
          setLoading(false);
        }
      };

      fetchWasteData();

      return () => { };
    }, [])
  );

  return { wastes, loading, setWastes };
};
