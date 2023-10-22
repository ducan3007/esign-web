import { Document, DocumentUploading, initialState } from './reducers'

const namespace = 'document'

// prettier-ignore
export default {
  getUploadingDocuments:  (state: any): { [key: string]: DocumentUploading } => state[namespace]?.document_uploading,
  getDocumentsStates:     (state: any): typeof initialState => state[namespace],
  getDocuments:           (state: any): { [key: string]: Document } => state[namespace]?.documents,
  getLoadingDocuments:    (state: any): boolean => state[namespace]?.loading_documents,
  getDocumentDetail:      (state: any): Document => state[namespace]?.document_detail,
  getDoucmentFromStore:   (id: any) => (state: any): Document => state[namespace]?.documents?.documents?.[id],

  getTotal:               (state: any): number => state[namespace]?.total,
  selecteSignerById:      (id: any) => (state: any): any => state[namespace]?.signers?.[id],
  
  getSignatures:          (state: any): typeof initialState.signatures => state[namespace]?.signatures,
  getSignatureByPage:     (page_number: any) => (state: any): any => state[namespace]?.signatures?.[page_number] || {},
  getSignatureById:       (page_number: any, id: any) => (state: any): any => state[namespace]?.signatures?.[page_number]?.[id],
  
  getSigners:             (state: any): any => state[namespace]?.signers,
  getSigners2:            (state: any): any => state[namespace]?.signers2,
  getDraftEnabled:        (state: any): boolean => state[namespace]?.isSaveDraftEnabled,

  getSignStatus :         (state: any): any => state[namespace]?.signersStatus,
  
}
