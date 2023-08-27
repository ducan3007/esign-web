import * as _ from './constants'

const fn = <T>(type: string, payload?: T) => {
  return { type, payload }
}

// prettier-ignore
export default {
    createSignature:     (payload: any) => fn(_.SIG_CREATE, payload),
    setSignatures:       (payload: any) => fn(_.SIG_SET, payload),
    toggleModal:         (payload: any) => fn(_.SIGNATURE_TOGGLE_MODAL, payload),
    toggleAutoSave:      (payload: any) => fn(_.SIGNATURE_AUTO_SAVE, payload),
}
