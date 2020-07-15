import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRepository } from '../../../models';
import { IRepositoryFilter } from '../../../shared';

export const sliceName = 'repositories';

interface IState {
  repositories: IRepository[];
  loading: boolean;
  error?: string | null;
}

export const initialState: IState = {
  repositories: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    getRepositories: (
      state: IState,
      action: PayloadAction<{ filters: IRepositoryFilter[] }>
    ): void => {
      state.loading = true;
      state.error = null;
    },
    getRepositoriesSuccess: (
      state: IState,
      action: PayloadAction<{ repositories: IRepository[] }>
    ): void => {
      const { repositories } = action.payload;
      state.repositories = repositories;
      state.loading = false;
      state.error = null;
    },
    getRepositoriesFailure: (state: IState, action: PayloadAction<string>): void => {
      state.loading = false;
      state.error = action.payload;
    },
    updateRepositoryStarred: (
      state: IState,
      action: PayloadAction<{
        repository: IRepository;
        star: boolean;
        filters: IRepositoryFilter[];
      }>
    ): void => {
      state.loading = true;
      state.error = null;
    },
    updateRepositoryStarredSuccess: (
      state: IState,
      action: PayloadAction<{ repository: IRepository }>
    ): void => {
      state.loading = false;
      state.error = null;
    },
    updateRepositoryStarredFailure: (
      state: IState,
      action: PayloadAction<{ repository: IRepository; error: string }>
    ): void => {
      state.loading = false;
      state.error = action.payload.error;
    },
  },
});

export const { actions, reducer } = slice;
