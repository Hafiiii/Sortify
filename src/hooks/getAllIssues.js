import { useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
// @react-navigation
import { useFocusEffect } from '@react-navigation/native';
// firebase
import { firestore } from '../utils/firebase';
// components
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

export const getAllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchIssues = async () => {
        try {
          const issuesCollectionRef = collection(firestore, 'issues');
          const issuesSnapshot = await getDocs(issuesCollectionRef);

          if (!issuesSnapshot.empty) {
            const usersList = issuesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setIssues(usersList);
          } else {
            Toast.show({ type: 'info', text1: 'No issues found.' });
            setIssues([]);
          }
        } catch (error) {
          Toast.show({ type: 'error', text1: 'An error occurred while fetching all issues.', text2: error.message || 'Please try again later.' });
        } finally {
          setLoading(false);
        }
      };

      fetchIssues();

      return () => { };
    }, [])
  );

  return { issues, loading, setIssues };
};
