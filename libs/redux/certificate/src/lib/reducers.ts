import { UserType } from '@esign-web/libs/utils'
import * as _ from './constants'
import { Signature } from 'libs/redux/signatures/src/lib/reducers'

export type Certificant = {
  id: string
  color: string
  firstName: string
  lastName: string
  email: string
  fields: number
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

export type CertState = {
  certificates: {}
  total: number

  loading_certificates: boolean

  signers: {
    [id: string]: Certificant
  }

  signers2: {
    [id: string]: Certificant
  }

  signatures: {
    [page_number: string]: {
      [id: string]: Signature
    }
  }

  total_certificants: number
  loading_certificants: boolean
  document_detail: Document | null
  document_detail_2: Document | null
}

export const initialState: CertState = {
  certificates: {},

  signers2: {},

  signers: {},

  signatures: {},

  total: 0,
  loading_certificates: false,

  total_certificants: 0,
  loading_certificants: false,
  document_detail: null,
  document_detail_2: null,
}

export default (state = initialState, action: any): CertState => {
  switch (action.type) {
    case _.CERT_SIGNATURE_SET: {
      let pageNumber = action.payload.pageNumber
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

    case _.SET_SIGNER_2: {
      return {
        ...state,
        signers2: action.payload,
      }
    }

    case _.SET_SIGNER: {
      return {
        ...state,
        signers: action.payload,
      }
    }

    case _.CERTIFICANT_SET:
      return {
        ...state,
        signers: action.payload,
      }

    /* ------------------------------ SIGNATURE---------------------------- */

    case _.CERT_SIGNATURES_UPDATE_DATA: {
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

    /* -------------------------------- CERTIFICATE ---------------------------------- */
    case _.GET_CERTIFICATE_ALL: {
      return {
        ...state,
        loading_certificates: true,
      }
    }

    case _.GET_CERTIFICATE_ALL_SUCCESS: {
      return {
        ...state,
        certificates: action.payload.certificates,
        total: action.payload.total,
        loading_certificates: false,
      }
    }

    case _.GET_ALL_CERTIFICANTS: {
      return {
        ...state,
        loading_certificants: true,
      }
    }

    case _.GET_ALL_CERTIFICANTS_SUCCESS: {
      return {
        ...state,
        signers: action.payload.certificant,
        total_certificants: action.payload.total,
        loading_certificants: false,
      }
    }

    case _.SET_CERT_DETAIL: {
      return {
        ...state,
        document_detail: action.payload,
      }
    }

    case _.SET_CERT_DETAIL_2: {
      return {
        ...state,
        document_detail_2: action.payload,
      }
    }

    case _.CLEAR_ALL_CERTIFICANTS: {
      return {
        ...state,
        signers: {},
      }
    }

    case _.CERT_SIGNATURES_CLEAR_ALL: {
      return {
        ...state,
        signatures: {},
      }
    }

    default:
      return state
  }
}
