import * as _ from './constants';

export type DocumentUploading = {
  id: string;
  name?: string;
  progress?: number;
  status?: 'uploading' | 'success' | 'failed' | 'canceled';
  size?: number;
  error_message: string;
  type?: string;
  url?: string;
  file: any;
};

export type Document = {
  id: string;
  name: string;
  cid: string;
  size: number;
  type: string;
  url: string;
  file: any;
};

type documentState = {
  document_uploading: {
    [key: string]: DocumentUploading;
  };
  documents: {
    [key: string]: Document;
  };
  loading_documents: boolean;
  uploading_documents: boolean;
};

export const initialState: documentState = {
  document_uploading: {},
  documents: {
    document: null as any,
  },
  uploading_documents: false,
  loading_documents: false,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case _.DOCUMENT_UPLOAD_RENDER:
      return {
        ...state,
        document_uploading: {
          ...state.document_uploading,
          [action.payload.id]: action.payload,
        },
        uploading_documents: true,
      };

    case _.DOCUMENT_UPLOAD_FAILED:
    case _.DOCUMENT_UPLOAD_SUCCESS:
      return {
        ...state,
        document_uploading: {
          ...state.document_uploading,
          [action.payload.id]: {
            ...state.document_uploading[action.payload.id],
            ...action.payload,
          },
        },
      };

    case _.DOCUMENT_UPLOAD_CANCEL:
      const copy = Object.assign({}, state.document_uploading);
      delete copy[action.payload.id];
      return {
        ...state,
        document_uploading: copy,
      };

    case _.DOCUMENT_UPLOAD_CANCEL_ALL:
      return {
        ...state,
        uploading_documents: false,
        document_uploading: {},
      };

    case _.DOCUMENT_GET_ALL:
      return {
        ...state,
        loading_documents: true,
      };

    case _.DOCUMENT_GET_ALL_SUCCESS:
      return {
        ...state,
        documents: action.payload,
        loading_documents: false,
      };

    default:
      return state;
  }
};
