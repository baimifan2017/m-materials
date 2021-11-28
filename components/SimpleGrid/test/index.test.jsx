import React from 'react';
import { shallow } from 'enzyme';
import SimpleGrid from '../src/index';
import '../src/main.scss';

it('renders', () => {
  const wrapper = shallow(<SimpleGrid />);
  expect(wrapper.find('.SimpleGrid').length).toBe(1);
});
