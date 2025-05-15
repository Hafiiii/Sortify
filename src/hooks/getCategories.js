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
  const { user } = useAuth();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchCategoryData = async () => {
        if (!user?.uid) {
          setLoading(false);
          return;
        }

        try {
          const categoriesCollectionRef = collection(firestore, 'categories');
          const categoriesSnapshot = await getDocs(categoriesCollectionRef);

          if (!categoriesSnapshot.empty) {
            const categoriesList = categoriesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setCategoryData(categoriesList);
          } else {
            Toast.show({
              type: 'error',
              text1: 'No waste type found.',
            });
            setCategoryData([]);
          }
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Error fetching waste types.',
          });
        } finally {
          setLoading(false);
        }
      };

      fetchCategoryData();

      return () => { };
    }, [user?.uid])
  );

  return { categoryData, loading, setCategoryData };
};
