
export interface StoredProposal {
  propuesta: any;
  caracteristicas: any;
  personal: any;
  costos: any;
  configuracion?: any;
}

export const getStoredProposals = (): StoredProposal[] => {
  const proposals: StoredProposal[] = [];
  
  // Buscar todas las propuestas guardadas en localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('propuesta_')) {
      try {
        const proposalData = localStorage.getItem(key);
        if (proposalData) {
          proposals.push(JSON.parse(proposalData));
        }
      } catch (error) {
        console.error('Error parsing proposal data:', error);
      }
    }
  }
  
  return proposals;
};

export const deleteStoredProposal = (codigoPropuesta: string): boolean => {
  try {
    localStorage.removeItem(`propuesta_${codigoPropuesta}`);
    return true;
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return false;
  }
};

export const getStoredProposal = (codigoPropuesta: string): StoredProposal | null => {
  try {
    const proposalData = localStorage.getItem(`propuesta_${codigoPropuesta}`);
    return proposalData ? JSON.parse(proposalData) : null;
  } catch (error) {
    console.error('Error getting proposal:', error);
    return null;
  }
};
