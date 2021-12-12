import React from 'react';
import './index.css';

export default function FormItem(props) {
  const { type, ...others } = props;

  return (
    <div className="FormItem" {...others}>Hello FormItem</div>
  );
}

FormItem.propTypes = {
};

FormItem.defaultProps = {
};
