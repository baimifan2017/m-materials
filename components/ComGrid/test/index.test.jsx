import React from 'react';
import { shallow } from 'enzyme';
import ComGrid from '../src/index';
import '../src/main.scss';

it('renders', () => {
  const wrapper = shallow(<ComGrid />);
  expect(wrapper.find('.ComGrid').length).toBe(1);
});
