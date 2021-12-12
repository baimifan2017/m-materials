import React from 'react';
import { shallow } from 'enzyme';
import ComTree from '../src/index';
import '../src/main.scss';

it('renders', () => {
  const wrapper = shallow(<ComTree />);
  expect(wrapper.find('.ComTree').length).toBe(1);
});
