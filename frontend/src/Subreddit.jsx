import React from 'react';
import SubredditSubmissions from './SubredditSubmissions';

function Subreddit(props) {
  const sortTime = props.sortTime || 'day';
  return (
    <div align='center'>
      <h1>r/{props.name}</h1>
      <SubredditSubmissions
        name={props.name}
        sortType='top'
        sortTime={sortTime}
        amount='10'
        onChangeSortTime={props.onChangeSortTime}
      />
    </div>
  );
}

export default Subreddit;
