import React from 'react';
import { shallow } from 'enzyme';
import FormItem from '../src/index';
import '../src/main.scss';

it('renders', () => {
  const wrapper = shallow(<FormItem />);
  expect(wrapper.find('.FormItem').length).toBe(1);
});
