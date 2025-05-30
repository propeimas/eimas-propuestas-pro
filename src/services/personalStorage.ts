
export interface PersonalData {
  nombre: string;
  cargo: string;
  experiencia: string;
  responsabilidades: string;
  profesion?: string;
}

const PERSONAL_STORAGE_KEY = 'personal_reutilizable';

export const getStoredPersonal = (): PersonalData[] => {
  try {
    const stored = localStorage.getItem(PERSONAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting stored personal:', error);
    return [];
  }
};

export const addPersonalToStorage = (personal: PersonalData): boolean => {
  try {
    const stored = getStoredPersonal();
    
    // Verificar si ya existe (evitar duplicados)
    const exists = stored.some(p => 
      p.nombre.toLowerCase() === personal.nombre.toLowerCase() &&
      p.cargo.toLowerCase() === personal.cargo.toLowerCase()
    );
    
    if (!exists) {
      stored.push(personal);
      localStorage.setItem(PERSONAL_STORAGE_KEY, JSON.stringify(stored));
      return true;
    }
    
    return false; // Ya existe
  } catch (error) {
    console.error('Error adding personal to storage:', error);
    return false;
  }
};

export const removePersonalFromStorage = (nombre: string, cargo: string): boolean => {
  try {
    const stored = getStoredPersonal();
    const filtered = stored.filter(p => 
      !(p.nombre.toLowerCase() === nombre.toLowerCase() && 
        p.cargo.toLowerCase() === cargo.toLowerCase())
    );
    
    localStorage.setItem(PERSONAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing personal from storage:', error);
    return false;
  }
};
