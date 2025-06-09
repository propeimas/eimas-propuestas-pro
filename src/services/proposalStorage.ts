
import { 
  saveProposal, 
  getProposals, 
  getProposal, 
  deleteProposal,
  FirestoreProposal 
} from './firestoreProposalService';
import { 
  saveCharacteristics, 
  getCharacteristicsByProposal 
} from './firestoreCharacteristicsService';
import { 
  savePersonalEquipos, 
  getPersonalEquiposByProposal 
} from './firestorePersonalService';
import { 
  saveCostos, 
  getCostosByProposal 
} from './firestoreCostosService';

export interface StoredProposal {
  propuesta: any;
  caracteristicas: any;
  personal: any;
  costos: any;
  configuracion?: any;
}

// Guardar propuesta completa en Firestore
export const saveCompleteProposal = async (proposalData: StoredProposal): Promise<string> => {
  try {
    // 1. Guardar propuesta principal
    const proposalId = await saveProposal(proposalData.propuesta);
    
    // 2. Guardar características técnicas
    if (proposalData.caracteristicas) {
      await saveCharacteristics({
        propuestaId: proposalId,
        ...proposalData.caracteristicas
      });
    }
    
    // 3. Guardar personal y equipos
    if (proposalData.personal) {
      await savePersonalEquipos({
        propuestaId: proposalId,
        ...proposalData.personal
      });
    }
    
    // 4. Guardar costos
    if (proposalData.costos) {
      await saveCostos({
        propuestaId: proposalId,
        ...proposalData.costos
      });
    }
    
    return proposalId;
  } catch (error) {
    console.error('Error saving complete proposal:', error);
    throw error;
  }
};

export const getStoredProposals = async (): Promise<StoredProposal[]> => {
  try {
    const proposals = await getProposals();
    
    // Convertir el formato de Firestore al formato esperado por la aplicación
    const storedProposals = await Promise.all(
      proposals.map(async (proposal) => {
        const caracteristicas = await getCharacteristicsByProposal(proposal.id!);
        const personal = await getPersonalEquiposByProposal(proposal.id!);
        const costos = await getCostosByProposal(proposal.id!);
        
        return {
          propuesta: proposal,
          caracteristicas: caracteristicas || {},
          personal: personal || {},
          costos: costos || {}
        };
      })
    );
    
    return storedProposals;
  } catch (error) {
    console.error('Error getting stored proposals:', error);
    return [];
  }
};

export const deleteStoredProposal = async (codigoPropuesta: string): Promise<boolean> => {
  try {
    // Buscar la propuesta por código
    const proposals = await getProposals();
    const proposal = proposals.find(p => p.codigoPropuesta === codigoPropuesta);
    
    if (proposal && proposal.id) {
      return await deleteProposal(proposal.id);
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return false;
  }
};

export const getStoredProposal = async (codigoPropuesta: string): Promise<StoredProposal | null> => {
  try {
    const proposals = await getProposals();
    const proposal = proposals.find(p => p.codigoPropuesta === codigoPropuesta);
    
    if (proposal && proposal.id) {
      const caracteristicas = await getCharacteristicsByProposal(proposal.id);
      const personal = await getPersonalEquiposByProposal(proposal.id);
      const costos = await getCostosByProposal(proposal.id);
      
      return {
        propuesta: proposal,
        caracteristicas: caracteristicas || {},
        personal: personal || {},
        costos: costos || {}
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting proposal:', error);
    return null;
  }
};
