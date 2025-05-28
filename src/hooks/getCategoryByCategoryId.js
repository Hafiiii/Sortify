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

export const getCategoryByCategoryId = (categoryId) => {
    const { user } = useAuth();
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchCategory = async () => {
                if (!user?.uid || !categoryId) {
                    setLoading(false);
                    return;
                }

                try {
                    const categoriesCollectionRef = collection(firestore, 'categories');
                    const q = query(categoriesCollectionRef, where('categoryId', 'in', categoryId));
                    const categoriesSnapshot = await getDocs(q);

                    if (!categoriesSnapshot.empty) {
                        const categoriesList = categoriesSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));
                        setCategory(categoriesList);
                    } else {
                        Toast.show({ type: 'error', text1: 'No matching categories found.', text2: error.message || 'Please try again later.' });
                        setCategory([]);
                    }
                } catch (error) {
                    Toast.show({ type: 'error', text1: 'Error fetching categories.', text2: error.message || 'Please try again later.' });
                } finally {
                    setLoading(false);
                }
            };

            fetchCategory();
        }, [user?.uid, categoryId])
    );

    return { category, loading, setCategory };
};
