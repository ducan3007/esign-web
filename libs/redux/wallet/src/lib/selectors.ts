import { Wallet } from './reducers'

const namespace = 'wallet'
export default {
  getWalletState: (state: any) => state[namespace],
  getDocumentABI: (state: { wallet: Wallet }) => state[namespace].contract[0],
  getCertABI: (state: { wallet: Wallet }) => state[namespace].contract[1],
}
