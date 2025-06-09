
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

export interface FirestorePersonalEquipos {
  id?: string;
  propuestaId: string;
  personal: Array<{
    nombre: string;
    cargo: string;
    experiencia: string;
    responsabilidades: string;
    profesion?: string;
  }>;
  equipos: Array<{
    nombre: string;
    marca: string;
    modelo: string;
    calibracion: string;
    funcion: string;
  }>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const savePersonalEquipos = async (data: Omit<FirestorePersonalEquipos, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'personal_equipos'), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving personal y equipos:', error);
    throw error;
  }
};

export const getPersonalEquiposByProposal = async (propuestaId: string): Promise<FirestorePersonalEquipos | null> => {
  try {
    const q = query(collection(db, 'personal_equipos'), where('propuestaId', '==', propuestaId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as FirestorePersonalEquipos;
    }
    return null;
  } catch (error) {
    console.error('Error getting personal y equipos:', error);
    throw error;
  }
};
