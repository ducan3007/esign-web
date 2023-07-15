import * as _ from './constants';

type DocumentUploading = {
  id: string;
  name: string;
  progress: number;
  status: string;
  size: number;
  type: string;
  url: string;
};

type Document = {
  id: string;
  name: string;
  cid: string;
  size: number;
  type: string;
  url: string;
};

type documentState = {
  document_uploading: DocumentUploading[];
  documents: Document[];
  loading_document: boolean;
  uploading_document: boolean;
};

export const initialState: documentState = {
  document_uploading: [],
  documents: [],
  uploading_document: false,
  loading_document: false,
};

export default (state = initialState, action: any) => {};
