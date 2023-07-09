import { initialState } from './reducers';

const ns = 'auth';

export const getAuthState = (state: any): typeof initialState => state[ns];
