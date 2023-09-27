import { UserType } from '@esign-web/libs/utils'
import * as _ from './constants'
import { Signature } from 'libs/redux/signatures/src/lib/reducers'

type Signers = {
  id: string
  color: string
  firstName: string
  lastName: string
  email: string
  fields: number
}

export type DocumentUploading = {
  id: string
  name?: string
  progress?: number
  status?: 'uploading' | 'success' | 'failed' | 'canceled'
  size?: number
  error_message: string
  type?: string
  url?: string
  file: any
}

export type Document = {
  id: string
  user_id: string
  original_hash_256: string
  hash256: string
  final_hash256: string
  thumbnail: string
  status: string
  is_scanned: boolean
  name: string
  createdAt: string
  updatedAt: string
  cid: string
  size: number
  type: string
  user: UserType
  url: string
  file: any
  document_signer?: any[]
}
export enum SignatureType {
  SIGNATURE = 'signature',
  TEXT = 'textField',
  DATE = 'dateField',
  CHECKBOX = 'checkbox',
}

// export type Singature = {
//   id?: string
//   top?: number
//   left?: number
//   pageNumber?: number
//   width?: number
//   height: number
//   type?: SignatureType
//   isMetadata?: boolean
//   // For User
//   userName?: string
//   userColor?: string
//   userEmail?: string

//   user: {
//     id: string
//     firstName: string
//     lastName: string
//     email: string
//     color: string
//   }
//   // For Image
//   imageUri?: string
//   // For Text
//   text?: string
//   // For Date
//   date?: string
//   // For Checkbox
//   isChecked?: boolean
//   signature_data?: {
//     type: string
//     data: any
//   }
// }

type documentState = {
  document_uploading: {
    [key: string]: DocumentUploading
  }
  documents: {
    [key: string]: Document
  }
  loading_documents: boolean
  uploading_documents: boolean

  signers: {
    [id: string]: Signers
  }

  signers2: {
    [id: string]: Signers
  }

  signatures: {
    [page_number: string]: {
      [id: string]: Signature
    }
  }

  total: number

  document_detail: Document | null

  isSaveDraftEnabled: Boolean

  signersStatus: {}
}

export const initialState: documentState = {
  document_uploading: {},

  documents: {},

  uploading_documents: false,

  loading_documents: false,

  signers2: {},

  signers: {},

  signatures: {},

  total: 0,

  document_detail: null,

  isSaveDraftEnabled: false,

  signersStatus: {},
}

export default (state = initialState, action: any) => {
  switch (action.type) {
    case _.DISABLE_SAVE_DRAFT: {
      return {
        ...state,
        isSaveDraftEnabled: false,
      }
    }

    case _.ENABLE_SAVE_DRAFT: {
      return {
        ...state,
        isSaveDraftEnabled: true,
      }
    }

    case _.DOCUMENT_UPLOAD_RENDER:
      return {
        ...state,
        document_uploading: {
          ...state.document_uploading,
          [action.payload.id]: action.payload,
        },
        uploading_documents: true,
      }

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
      }

    case _.DOCUMENT_UPLOAD_CANCEL:
      const copy = Object.assign({}, state.document_uploading)
      delete copy[action.payload.id]
      return {
        ...state,
        document_uploading: copy,
      }

    case _.DOCUMENT_UPLOAD_CANCEL_ALL:
      return {
        ...state,
        uploading_documents: false,
        document_uploading: {},
      }

    case _.DOCUMENT_GET_ALL:
      return {
        ...state,
        loading_documents: true,
      }

    case _.SET_SIGNER_STATUS: {
      return {
        ...state,
        signersStatus: action.payload,
      }
    }

    case _.DOCUMENT_GET_ALL_SUCCESS:
      return {
        ...state,
        documents: action.payload.documents,
        total: action.payload.total,
        loading_documents: false,
      }

    case _.DOCUMENT_SET_DETAIL: {
      return {
        ...state,
        document_detail: action.payload,
      }
    }

    /* ------------------------------ SIGNATURE---------------------------- */

    case _.SIGNATURES_UPDATE_DATA: {
      const type = action.payload.type
      const data = action.payload.data

      return {
        ...state,
        signatures: {
          ...state.signatures,
          [`page_${action.payload.pageNumber}`]: {
            ...state.signatures[`page_${action.payload.pageNumber}`],
            [action.payload.id]: {
              ...state.signatures[`page_${action.payload.pageNumber}`][action.payload.id],
              signature_data: {
                type,
                data,
              },
            },
          },
        },
      }
    }

    case _.SIGNATURE_SET: {
      const pageNumber = action.payload.pageNumber
      return {
        ...state,
        signatures: {
          ...state.signatures,
          [`page_${pageNumber}`]: {
            ...state.signatures[`page_${pageNumber}`],
            [action.payload.id]: action.payload,
          },
        },
      }
    }

    case _.SIGNATURES_UPDATE_DATA: {
      let pageNumber = action.payload.pageNumber
      let id = action.payload.id

      return {
        ...state,
        signatures: {
          ...state.signatures,
          [`page_${pageNumber}`]: {
            ...state.signatures[`page_${pageNumber}`],
            [id]: {
              ...state.signatures[`page_${pageNumber}`][id],
              signature_data: {
                type: action.payload.type,
                data: action.payload.data,
              },
            },
          },
        },
      }
    }

    case _.SIGNER_UPDATE_FIELDS: {
      const fields1 = action.payload.fields || 0
      const fields2 = action.payload.fields2 || 0
      const id: string = action.payload.id

      return {
        ...state,
        signers2: {
          ...state.signers2,
          [id]: {
            ...state.signers2[id],
            fields: state.signers2[id].fields + fields2,
          },
        },
        signers: {
          ...state.signers,
          [id]: {
            ...state.signers[id],
            fields: state.signers[id].fields + fields1,
          },
        },
      }
    }

    case _.SIGNERS_CLEAR_ALL: {
      return {
        ...state,
        signers: {},
        signers2: {},
      }
    }

    case _.SIGNATURE_REMOVE: {
      const copySignatures = Object.assign({}, state.signatures)
      const pageNumberRemove = action.payload.pageNumber
      const id = action.payload.id
      const signer_id = action.payload.signer_id
      const page = copySignatures[`page_${pageNumberRemove}`]
      delete page[id]

      return {
        ...state,
        signatures: copySignatures,
        signers: {
          ...state.signers,
          [signer_id]: {
            ...state.signers[signer_id],
            fields: state.signers[signer_id].fields - 1,
          },
        },
        signers2: {
          ...state.signers2,
          [signer_id]: {
            ...state.signers2[signer_id],
            fields: state.signers2[signer_id].fields - 1,
          },
        },
      }
    }

    case _.SIGNATRURE_MOVE: {
      let copySignatures = Object.assign({}, state.signatures)
      console.log('copySignatures', copySignatures)
      let nextPage = action.payload.nextPage
      let currentPage = action.payload.currentPage
      let id = action.payload.id

      if (!copySignatures[`page_${nextPage}`]) {
        copySignatures[`page_${nextPage}`] = {}
      }

      copySignatures[`page_${nextPage}`][id] = {
        ...copySignatures[`page_${currentPage}`][id],
        top: action.payload.newTop,
        pageNumber: nextPage,
      }

      delete copySignatures[`page_${currentPage}`][id]

      return {
        ...state,
        signatures: copySignatures,
      }
    }

    case _.SIGNATURES_CLEAR_ALL: {
      return {
        ...state,
        signatures: {},
      }
    }

    case _.SIGNATURES_UPDATE_ALL: {
      return {
        ...state,
        signatures: action.payload,
      }
    }

    /* ------------------------ SIGNER ---------------------------- */
    case _.SIGNER_REMOVE:
      const copySigners = Object.assign({}, state.signers)
      delete copySigners[action.payload.id as keyof typeof copySigners]
      return {
        ...state,
        signers: copySigners,
      }

    case _.SIGNER_SET:
      return {
        ...state,
        signers: {
          ...state.signers,
          [action.payload.id]: action.payload,
        },
      }

    case _.SIGNERS_UPDATE_ALL:
      return {
        ...state,
        signers: action.payload,
      }

    /* ------------------------ SIGNER 2 ---------------------------- */
    case _.SIGNER_REMOVE_2: {
      const copySigners = Object.assign({}, state.signers2)
      delete copySigners[action.payload.id as keyof typeof copySigners]
      return {
        ...state,
        signers2: copySigners,
      }
    }

    case _.SIGNER_SET_2:
      return {
        ...state,
        signers2: {
          ...state.signers2,
          [action.payload.id]: action.payload,
        },
      }

    case _.SIGNERS_UPDATE_ALL_2:
      return {
        ...state,
        signers2: action.payload,
      }

    default:
      return state
  }
}
