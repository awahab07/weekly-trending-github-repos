import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { AnyAction } from 'redux';
import { RootState } from '../root.reducer';
import mockStore from './store.mock';

export const MockStoreProvider = (
  props: PropsWithChildren<{
    dispatch?: (action: AnyAction) => any;
    getState?: (...args: any[]) => RootState;
  }>
): React.ReactElement => {
  if (props.dispatch !== undefined) {
    mockStore.dispatch = props.dispatch;
  }

  if (props.getState !== undefined) {
    mockStore.getState = props.getState;
  }

  return <Provider store={mockStore}>{props.children}</Provider>;
};
