import * as _ from './constants'

enum SignatureType {
  SIGNATURE = 'signature',
  TEXT = 'textField',
  DATE = 'dateField',
  CHECKBOX = 'checkbox',
}

export enum SignatureContent {
  text = 'text',
  canvas = 'canvas',
  image = 'image',
  mySignature = 'mySignature',
}

export type Signature = {
  id: string
  top: number
  left: number
  pageNumber?: number
  width: number
  height: number
  type: SignatureType
  isMetadata?: boolean
  // For User
  userName?: string
  userColor?: string
  userEmail?: string

  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    color: string
  }
  // For Image
  imageUri?: string
  // For Text
  text?: string
  // For Date
  date?: string
  // For Checkbox
  isChecked?: boolean
  signature_data: {
    type?: SignatureContent
    data?: any
    url?: string
    fontSize?: {
      pt: string
      pixel: string,
      lineHeight: string
    }

    fontFamily?: {
      fontFamily: string
      value: string
    }
  }
}

type signatureState = {
  signatures1: {
    [key: string]: Signature
  }
  isModalOpen: boolean
  isSignatureAuto?: boolean
}

export const initialState: signatureState = {
  signatures1: {},
  isModalOpen: false,
  isSignatureAuto: localStorage.getItem('signatureAutoSave') === 'true' ? true : false,
}

export default (state = initialState, action: any) => {
  switch (action.type) {
    case _.SIGNATURE_TOGGLE_MODAL: {
      return {
        ...state,
        isModalOpen: !state.isModalOpen,
      }
    }

    case _.SIGNATURE_AUTO_SAVE: {
      localStorage.setItem('signatureAutoSave', !state.isSignatureAuto ? 'true' : 'false')
      return {
        ...state,
        isSignatureAuto: !state.isSignatureAuto,
      }
    }

    default:
      return state
  }
}
