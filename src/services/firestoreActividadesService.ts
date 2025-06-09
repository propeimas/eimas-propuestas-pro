
import { 
  collection, 
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Actividad, Metodo } from '@/types/proposal';

export const getActividades = async (): Promise<Actividad[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'AIRE-FUENTES-FIJAS'));
    const actividades: Actividad[] = [];
    
    querySnapshot.forEach((doc) => {
      actividades.push({
        id: doc.id,
        ...doc.data()
      } as Actividad);
    });
    
    return actividades;
  } catch (error) {
    console.error('Error getting actividades:', error);
    return [];
  }
};

export const getMetodosByActividad = async (actividadId: string): Promise<string[]> => {
  try {
    const actividadDoc = await getDoc(doc(db, 'AIRE-FUENTES-FIJAS', actividadId));
    
    if (actividadDoc.exists()) {
      const data = actividadDoc.data();
      return data.metodos || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting métodos:', error);
    return [];
  }
};

export const getCalidadAire = async (): Promise<Actividad[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'CALIDAD_AIRE'));
    const actividades: Actividad[] = [];
    
    querySnapshot.forEach((doc) => {
      actividades.push({
        id: doc.id,
        ...doc.data()
      } as Actividad);
    });
    
    return actividades;
  } catch (error) {
    console.error('Error getting calidad aire:', error);
    return [];
  }
};

export const getOloresSensivos = async (): Promise<Actividad[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'OLORESOFENSIVOS'));
    const actividades: Actividad[] = [];
    
    querySnapshot.forEach((doc) => {
      actividades.push({
        id: doc.id,
        ...doc.data()
      } as Actividad);
    });
    
    return actividades;
  } catch (error) {
    console.error('Error getting olores ofensivos:', error);
    return [];
  }
};

export const getRuido = async (): Promise<Actividad[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'RUIDO'));
    const actividades: Actividad[] = [];
    
    querySnapshot.forEach((doc) => {
      actividades.push({
        id: doc.id,
        ...doc.data()
      } as Actividad);
    });
    
    return actividades;
  } catch (error) {
    console.error('Error getting ruido:', error);
    return [];
  }
};
