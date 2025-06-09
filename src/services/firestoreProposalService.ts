
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
  orderBy 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface FirestoreProposal {
  id?: string;
  fechaRecepcion: string;
  fechaAprobacion?: string;
  medioSolicitud: string;
  nombreSolicitante: string;
  nombreReceptor: string;
  empresaCliente: string;
  mesAproximadoServicio: string;
  tipoServicio: string;
  municipio: string;
  telefono: string;
  email: string;
  descripcionServicio: string;
  valorPropuesta: number;
  codigoPropuesta: string;
  seguimientoObservaciones: string;
  objetivo: string;
  alcance: string;
  duracion: number;
  estado: 'PENDIENTE' | 'EN PROCESO' | 'ACEPTADA' | 'RECHAZADA';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Guardar propuesta principal
export const saveProposal = async (proposalData: Omit<FirestoreProposal, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'propuestas'), {
      ...proposalData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving proposal:', error);
    throw error;
  }
};

// Obtener todas las propuestas
export const getProposals = async (): Promise<FirestoreProposal[]> => {
  try {
    const q = query(collection(db, 'propuestas'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt
    } as FirestoreProposal));
  } catch (error) {
    console.error('Error getting proposals:', error);
    throw error;
  }
};

// Obtener una propuesta específica
export const getProposal = async (id: string): Promise<FirestoreProposal | null> => {
  try {
    const docRef = doc(db, 'propuestas', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as FirestoreProposal;
    }
    return null;
  } catch (error) {
    console.error('Error getting proposal:', error);
    throw error;
  }
};

// Eliminar propuesta
export const deleteProposal = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'propuestas', id));
    return true;
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return false;
  }
};
