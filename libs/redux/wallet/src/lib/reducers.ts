import * as _ from './constants'

type Wallet = {
  type?: string
  provider?: string
  connected?: boolean
  address?: Address[]
  contract: {
    abi?: any
    address?: string
  }
}
type Address = {
  address: string
}

export const initialState: Wallet = {
  provider: '',
  connected: false,
  address: [],
  contract: {},
}

export default (state = initialState, action: any) => {
  switch (action.type) {
    case _.WALLET_SET_CONNECTED:
      return {
        ...state,
        provider: action.payload.provider,
        connected: action.payload.connected,
        address: action.payload.address,
      }
    case _.SET_CONTRACT_ABI:
      return {
        ...state,
        contract: action.payload,
      }
    default:
      return state
  }
}
