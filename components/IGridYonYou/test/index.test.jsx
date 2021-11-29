import React from 'react';
import { shallow } from 'enzyme';
import IGridYonYou from '../src/index';
import '../src/main.scss';

it('renders', () => {
  const wrapper = shallow(<IGridYonYou />);
  expect(wrapper.find('.IGridYonYou').length).toBe(1);
});
