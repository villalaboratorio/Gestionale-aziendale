import { useCottureCore } from './useCottureCore';
import { useCottureFlow } from './useCottureFlow';
import { useCottureImport } from './useCottureImport';

/**
 * Hook principale che combina tutti gli hook delle cotture
 */
export const useCottureManager = () => {
  const coreFeatures = useCottureCore();
  const flowFeatures = useCottureFlow();
  const importFeatures = useCottureImport();

  return {
    // Dati da useCottureCore
    lavorazione: coreFeatures.lavorazione,
    collections: coreFeatures.collections,
    saving: coreFeatures.saving,
    tipiCottura: coreFeatures.tipiCottura,
    cotture: coreFeatures.cotture,
    
    
    // Stati da useCottureCore e useCottureFlow
    isAddMode: coreFeatures.isAddMode,
    selectedCottura: coreFeatures.selectedCottura,
    showInterruptModal: flowFeatures.showInterruptModal,
    cotturaToInterrupt: flowFeatures.cotturaToInterrupt,
    
    // Funzioni di gestione stati da useCottureFlow
    setShowInterruptModal: flowFeatures.setShowInterruptModal,
    setCotturaToInterrupt: flowFeatures.setCotturaToInterrupt,
    
    // Funzioni CRUD da useCottureCore
    handleAddCottura: coreFeatures.handleAddCottura,
    handleEditCottura: coreFeatures.handleEditCottura,
    handleCancel: coreFeatures.handleCancel,
    handleSaveCottura: coreFeatures.handleSaveCottura,
    handleDeleteCottura: coreFeatures.handleDeleteCottura,
    
    // Funzioni di flusso da useCottureFlow
    handleStartCottura: flowFeatures.handleStartCottura,
    handleRequestInterrupt: flowFeatures.handleRequestInterrupt,
    handleInterruptCottura: flowFeatures.handleInterruptCottura,
    handleCompleteCottura: flowFeatures.handleCompleteCottura,
    
    // Funzioni di importazione da useCottureImport
    importCottureFromRicetta: importFeatures.importCottureFromRicetta
  };
};
