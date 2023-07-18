import * as _ from './constants';

const fn = <T>(type: string, payload: T) => {
  return { type, payload };
};

export default {
  uploadDocumentRender: (payload: any) => fn(_.DOCUMENT_UPLOAD_RENDER, payload),
  uploadDocumentSuccess: (payload: any) => fn(_.DOCUMENT_UPLOAD_SUCCESS, payload),
  uploadDocumentFailed: (payload: any) => fn(_.DOCUMENT_UPLOAD_FAILED, payload),
  uploadDocumentCancel: (payload: any) => fn(_.DOCUMENT_UPLOAD_CANCEL, payload),
  uploadDocumentCancelAll: (payload: any) => fn(_.DOCUMENT_UPLOAD_CANCEL_ALL, payload),

  documenStartUploading: (payload: any) => fn(_.DOCUMENT_UPLOAD_FILES, payload),
  documentGetAll: (payload: any) => fn(_.DOCUMENT_GET_ALL, payload),
};
