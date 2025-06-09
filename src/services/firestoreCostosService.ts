
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

export interface FirestoreCostos {
  id?: string;
  propuestaId: string;
  items: Array<{
    concepto: string;
    cantidad: number;
    valorUnitario: number;
    valorTotal: number;
  }>;
  subtotal: number;
  iva: number;
  total: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const saveCostos = async (data: Omit<FirestoreCostos, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'desglose_costos'), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving costos:', error);
    throw error;
  }
};

export const getCostosByProposal = async (propuestaId: string): Promise<FirestoreCostos | null> => {
  try {
    const q = query(collection(db, 'desglose_costos'), where('propuestaId', '==', propuestaId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as FirestoreCostos;
    }
    return null;
  } catch (error) {
    console.error('Error getting costos:', error);
    throw error;
  }
};
