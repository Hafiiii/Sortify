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

export const getCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchCategoryData = async () => {
        try {
          const categoriesCollectionRef = collection(firestore, 'categories');
          const categoriesSnapshot = await getDocs(categoriesCollectionRef);

          if (!categoriesSnapshot.empty) {
            const categoriesList = categoriesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setCategories(categoriesList);
          } else {
            Toast.show({ type: 'error', text1: 'No waste type found.' });
            setCategories([]);
          }
        } catch (error) {
          Toast.show({ type: 'error', text1: 'Error fetching waste types.', text2: error.message || 'Please try again later.' });
        } finally {
          setLoading(false);
        }
      };

      fetchCategoryData();

      return () => { };
    }, [])
  );

  return { categories, loading, setCategories };
};
