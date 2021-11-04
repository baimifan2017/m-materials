import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd'

import styles from './index.module.scss';

export default function ExampleBlock({ value }) {
  return (
    <div className={styles.ExampleBlock}>
      ExampleBlock {value}
      <Button>123</Button>
    </div>
  );   
}

ExampleBlock.propTypes = {
  value: PropTypes.string,
};

ExampleBlock.defaultProps = {
  value: 'string data',
};
