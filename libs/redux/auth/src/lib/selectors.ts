import { AuthType, initialState } from './reducers'

const ns = 'auth'

export default {
  getAuthState: (state: any): AuthType => state[ns],
  getSidebarState: (state: any): boolean => state[ns].isSidebarOpen,
}
