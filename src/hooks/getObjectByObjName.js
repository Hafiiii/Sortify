import { useState, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
// @react-navigation
import { useFocusEffect } from '@react-navigation/native';
// firebase
import { firestore } from '../utils/firebase';
// components
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

export const getObjectByObjName = (objName) => {
  const [object, setObject] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchObject = async () => {
        try {
          const objectsCollectionRef = collection(firestore, 'objects');
          const q = query(objectsCollectionRef, where('objName', '==', objName));
          const objectsSnapshot = await getDocs(q);

          if (!objectsSnapshot.empty) {
            const objectsList = objectsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setObject(objectsList);
          } else {
            Toast.show({ type: 'error', text1: 'No matching objects found.', text2: error.message || 'Please try again later.' });
            setObject([]);
          }
        } catch (error) {
          Toast.show({ type: 'error', text1: 'Error fetching objects.', text2: error.message || 'Please try again later.' });
        } finally {
          setLoading(false);
        }
      };

      fetchObject();
    }, [objName])
  );

  return { object, loading, setObject };
};
