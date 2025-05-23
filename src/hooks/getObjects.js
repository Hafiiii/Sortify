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

export const getObjects = () => {
  const { user } = useAuth();
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);


  useFocusEffect(
    useCallback(() => {
      const fetchObject = async () => {
        if (!user?.uid) {
          setLoading(false);
          return;
        }

        try {
          const objectsCollectionRef = collection(firestore, 'objects');
          const objectsSnapshot = await getDocs(objectsCollectionRef);

          if (!objectsSnapshot.empty) {
            const objectsList = objectsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setObjects(objectsList);
          } else {
            Toast.show({
              type: 'error',
              text1: 'No objects found.',
            });
            setObjects([]);
          }
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Error fetching objects.',
          });
        } finally {
          setLoading(false);
        }
      };

      fetchObject();

      return () => { };
    }, [user?.uid])
  );

  return { objects, loading, setObjects };
};
