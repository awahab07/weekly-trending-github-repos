import { mount } from 'enzyme';
import 'jest';
import React from 'react';
import { StaticRouter } from 'react-router';
import { MOCK_REPOS } from '../../../shared/testing';
import { MockStoreProvider } from '../../../store/test';
import RepositoryContainer from './RepositoryContainer';

declare const global: any;

global.window = Object.create(window);
const url = 'http://test.com/category/product';
Object.defineProperty(window, 'location', {
  value: {
    href: url
  }
});

describe('Vip renders correctly', () => {
  it('should render correctly', () => {
    const Component = (
      <MockStoreProvider
        getState={() => ({ repositorySlice: { repositories: MOCK_REPOS as any, loading: false, error: null } })}
      >
        <StaticRouter>
          <RepositoryContainer />
        </StaticRouter>
      </MockStoreProvider>
    );
    const mounted = mount(Component);

    expect(mounted).toMatchSnapshot();
  });
});
