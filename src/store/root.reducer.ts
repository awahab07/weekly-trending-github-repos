import { combineReducers } from '@reduxjs/toolkit';

import { repositoryReducer } from '../features/repository';

const rootReducer = combineReducers({
  repositorySlice: repositoryReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
