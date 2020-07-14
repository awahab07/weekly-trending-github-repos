import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer from '../root.reducer';

const middleware = [...getDefaultMiddleware({ thunk: false })];
const mockStore = configureStore({ reducer: rootReducer, middleware });

export default mockStore;
