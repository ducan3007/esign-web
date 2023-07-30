import { DocumentUploading, initialState } from './reducers';

const namespace = 'document';

export default {
  getUploadingDocuments: (state: any): { [key: string]: DocumentUploading } => state[namespace]?.document_uploading,
  getDocumentsStates: (state: any): typeof initialState => state[namespace],
  getDocuments: (state: any): { [key: string]: Document } => state[namespace]?.documents,
  getLoadingDocuments: (state: any): boolean => state[namespace]?.loading_documents,

  getDocumentDetail: (state: any): Document => state[namespace]?.document_detail,

  getDoucmentFromStore: (id: any) => (state: any): Document => state[namespace]?.documents?.documents?.[id],
};
