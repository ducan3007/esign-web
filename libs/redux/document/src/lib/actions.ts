import * as _ from './constants'

const fn = <T>(type: string, payload?: T) => {
  return { type, payload }
}

// prettier-ignore
export default {
  uploadDocumentRender:         (payload: any) => fn(_.DOCUMENT_UPLOAD_RENDER, payload),
  uploadDocumentSuccess:        (payload: any) => fn(_.DOCUMENT_UPLOAD_SUCCESS, payload),
  uploadDocumentFailed:         (payload: any) => fn(_.DOCUMENT_UPLOAD_FAILED, payload),
  uploadDocumentCancel:         (payload: any) => fn(_.DOCUMENT_UPLOAD_CANCEL, payload),
  uploadDocumentCancelAll:      (payload: any) => fn(_.DOCUMENT_UPLOAD_CANCEL_ALL, payload),

  documenStartUploading:        (payload: any) => fn(_.DOCUMENT_UPLOAD_FILES, payload),
  documentGetAll:               (payload: any) => fn(_.DOCUMENT_GET_ALL, payload),

  cloneDocument:                (payload: any) => fn(_.DOCUMENT_CREATE_CLONE, payload),

  getDocumentDetail:            (payload: any) => fn(_.DOCUMENT_GET_DETAIL, payload),

  /*---------- Signers ------------ */
  updateAllSigners:             (payload: any) => fn(_.SIGNERS_UPDATE_ALL, payload),
  updateAllSigners2:            (payload: any) => fn(_.SIGNERS_UPDATE_ALL_2, payload),
  setSigner2:                   (payload: any) => fn(_.SIGNER_SET_2, payload),
  setSigners:                   (payload: any) => fn(_.SIGNER_SET, payload),
  removeSigner:                 (payload: any) => fn(_.SIGNER_REMOVE, payload),
  updateSignerFields:           (payload: any) => fn(_.SIGNER_UPDATE_FIELDS, payload),
  clearAllSigners:              (payload: any) => fn(_.SIGNERS_CLEAR_ALL, payload),

  /*---------- Signature ------------ */
  setSignature:                 (payload: any) => fn(_.SIGNATURE_SET, payload),
  moveSignature:                (payload: any) => fn(_.SIGNATRURE_MOVE, payload),
  getAllSignatures:             (payload: any) => fn(_.SIGNATURES_GET_ALL, payload),
  removeSignature:              (payload: any) => fn(_.SIGNATURE_REMOVE, payload),
  clearAllSignatures:           (payload: any) => fn(_.SIGNATURES_CLEAR_ALL, payload),
  updateAllSignatures:          (payload: any) => fn(_.SIGNATURES_UPDATE_ALL, payload),
  updateDataSignatures:         (payload: any) => fn(_.SIGNATURES_UPDATE_DATA, payload),
}
