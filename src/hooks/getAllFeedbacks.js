import { useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
// @react-navigation
import { useFocusEffect } from '@react-navigation/native';
// firebase
import { firestore } from '../utils/firebase';
// components
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

export const getAllFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchFeedbacks = async () => {
        try {
          const feedbacksCollectionRef = collection(firestore, 'feedbacks');
          const feedbacksSnapshot = await getDocs(feedbacksCollectionRef);

          if (!feedbacksSnapshot.empty) {
            const usersList = feedbacksSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setFeedbacks(usersList);
          } else {
            Toast.show({ type: 'info', text1: 'No feedbacks found.' });
            setFeedbacks([]);
          }
        } catch (error) {
          Toast.show({ type: 'error', text1: 'An error occurred while fetching all feedbacks.', text2: error.message || 'Please try again later.' });
        } finally {
          setLoading(false);
        }
      };

      fetchFeedbacks();

      return () => { };
    }, [])
  );

  return { feedbacks, loading, setFeedbacks };
};
