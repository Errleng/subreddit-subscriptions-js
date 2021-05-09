import React from 'react';

function TimePeriodSelect(props) {
  function handleChange(event) {
    props.postHandleChange(event);
  }

  return (
    <select
      className='custom-select w-auto'
      value={props.timePeriod}
      onChange={handleChange}
    >
      <option value='hour'>Hour</option>
      <option value='day'>Day</option>
      <option value='week'>Week</option>
      <option value='month'>Month</option>
      <option value='year'>Year</option>
      <option value='all'>All time</option>
    </select>
  );
}

export default TimePeriodSelect;
