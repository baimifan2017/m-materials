import React from 'react';
import { shallow } from 'enzyme';
import ComList from '../src/index';
import '../src/main.scss';

it('renders', () => {
  const wrapper = shallow(<ComList />);
  expect(wrapper.find('.ComList').length).toBe(1);
});
