import { shallow } from 'enzyme';
import React from 'react';
import { StaticRouter } from 'react-router';
import { MockStoreProvider } from '../store/test';
import App from './App';

declare const global: any;

global.window = Object.create(window);
const url = 'http://test.com/category/product';
Object.defineProperty(window, 'location', {
  value: {
    href: url
  }
});

describe('App renders correctly', () => {
  it('should render correctly', () => {
    const Component = (
      <MockStoreProvider>
        <StaticRouter>
          <App />
        </StaticRouter>
      </MockStoreProvider>
    );
    const component = shallow(Component);

    expect(component).toMatchSnapshot();
  });
});
