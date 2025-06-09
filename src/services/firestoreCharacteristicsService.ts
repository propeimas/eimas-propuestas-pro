
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp,
  query,
  where 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface FirestoreCharacteristics {
  id?: string;
  propuestaId: string;
  metodologia: string;
  equiposUtilizados: string[];
  parametrosAnalizar: string[];
  normasReferencia: string[];
  procedimientos: string;
  controlCalidad: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const saveCharacteristics = async (data: Omit<FirestoreCharacteristics, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'caracteristicas_tecnicas'), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving characteristics:', error);
    throw error;
  }
};

export const getCharacteristicsByProposal = async (propuestaId: string): Promise<FirestoreCharacteristics | null> => {
  try {
    const q = query(collection(db, 'caracteristicas_tecnicas'), where('propuestaId', '==', propuestaId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as FirestoreCharacteristics;
    }
    return null;
  } catch (error) {
    console.error('Error getting characteristics:', error);
    throw error;
  }
};
