import { initialState } from './reducers'
const namespace = 'signatures'

export default {
  getModalState: (state: any): any => state[namespace]?.isModalOpen,
  getAutoSave:   (state: any): any => state[namespace]?.isSignatureAuto,
}
