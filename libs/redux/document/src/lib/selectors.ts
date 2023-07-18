import { DocumentUploading, initialState } from './reducers';

const namespace = 'document';

export default {
  getUploadingDocuments: (state: any): { [key: string]: DocumentUploading } => state[namespace]?.document_uploading,
  getDocumentsStates: (state: any): typeof initialState => state[namespace],
  getDocuments: (state: any): { [key: string]: Document } => state[namespace]?.documents,
};
