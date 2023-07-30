import { initialState } from './reducers';

const ns = 'auth';

export default {
  getAuthState: (state: any): typeof initialState => state[ns],
  getSidebarState: (state: any): boolean => state[ns].isSidebarOpen,
};
