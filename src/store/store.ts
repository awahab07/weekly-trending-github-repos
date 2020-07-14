import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { HmrAcceptor } from '../app/hmr';

import rootReducer from './root.reducer';
import { rootSaga } from './root.saga';

const sagaMiddleware = createSagaMiddleware();

const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];

const store = configureStore({
  reducer: rootReducer,
  middleware,
});

sagaMiddleware.run(rootSaga);

export const acceptHotStore = (accept: HmrAcceptor): void => {
  accept('./root.reducer', (): void => {
    const newRootReducer = require('./root.reducer').default;
    store.replaceReducer(newRootReducer);
  });
};

export default store;
