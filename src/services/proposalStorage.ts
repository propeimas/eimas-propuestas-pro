
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
import { Propuesta, CaracteristicasTecnicas, PersonalEquipo, DesgloseCostos } from '@/types/proposal';

export interface StoredProposal {
  propuesta: Propuesta;
  caracteristicas: CaracteristicasTecnicas;
  personal: PersonalEquipo;
  costos: DesgloseCostos;
  configuracion?: any;
}

// Guardar propuesta completa en Firestore
export const saveCompleteProposal = async (proposalData: StoredProposal): Promise<string> => {
  try {
    // Preparar los datos de la propuesta asegurando que tenga duracion
    const propuestaToSave = {
      ...proposalData.propuesta,
      duracion: proposalData.propuesta.duracion || 0
    };
    
    // 1. Guardar propuesta principal
    const proposalId = await saveProposal(propuestaToSave);
    
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
          propuesta: {
            ...proposal,
            id: proposal.id,
            createdAt: proposal.createdAt.toDate().toISOString(),
            updatedAt: proposal.updatedAt.toDate().toISOString()
          } as Propuesta,
          caracteristicas: caracteristicas ? {
            ...caracteristicas,
            propuestaId: proposal.id!
          } as CaracteristicasTecnicas : {
            propuestaId: proposal.id!,
            metodologia: '',
            equiposUtilizados: [],
            parametrosAnalizar: [],
            normasReferencia: [],
            procedimientos: '',
            controlCalidad: ''
          },
          personal: personal ? {
            ...personal,
            propuestaId: proposal.id!
          } as PersonalEquipo : {
            propuestaId: proposal.id!,
            personal: [],
            equipos: []
          },
          costos: costos ? {
            ...costos,
            propuestaId: proposal.id!
          } as DesgloseCostos : {
            propuestaId: proposal.id!,
            items: [],
            subtotal: 0,
            iva: 0,
            total: 0
          }
        };
      })
    );
    
    return storedProposals;
  } catch (error) {
    console.error('Error getting stored proposals:', error);
    return [];
  }
};

export const deleteStoredProposal = async (proposalId: string): Promise<boolean> => {
  try {
    return await deleteProposal(proposalId);
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return false;
  }
};

export const getStoredProposal = async (proposalId: string): Promise<StoredProposal | null> => {
  try {
    const proposal = await getProposal(proposalId);
    
    if (proposal) {
      const caracteristicas = await getCharacteristicsByProposal(proposalId);
      const personal = await getPersonalEquiposByProposal(proposalId);
      const costos = await getCostosByProposal(proposalId);
      
      return {
        propuesta: {
          ...proposal,
          createdAt: proposal.createdAt.toDate().toISOString(),
          updatedAt: proposal.updatedAt.toDate().toISOString()
        } as Propuesta,
        caracteristicas: caracteristicas ? {
          ...caracteristicas,
          propuestaId: proposalId
        } as CaracteristicasTecnicas : {
          propuestaId: proposalId,
          metodologia: '',
          equiposUtilizados: [],
          parametrosAnalizar: [],
          normasReferencia: [],
          procedimientos: '',
          controlCalidad: ''
        },
        personal: personal ? {
          ...personal,
          propuestaId: proposalId
        } as PersonalEquipo : {
          propuestaId: proposalId,
          personal: [],
          equipos: []
        },
        costos: costos ? {
          ...costos,
          propuestaId: proposalId
        } as DesgloseCostos : {
          propuestaId: proposalId,
          items: [],
          subtotal: 0,
          iva: 0,
          total: 0
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting proposal:', error);
    return null;
  }
};
