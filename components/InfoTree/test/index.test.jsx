import React from 'react';
import { shallow } from 'enzyme';
import InfoTree from '../src/index';
import '../src/main.scss';

it('renders', () => {
  const wrapper = shallow(<InfoTree />);
  expect(wrapper.find('.InfoTree').length).toBe(1);
});
