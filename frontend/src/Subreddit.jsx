import React from 'react';
import SubredditSubmissions from './SubredditSubmissions';

function Subreddit(props) {
  const sortTime = props.sortTime || 'day';
  return (
    <div align='center'>
      <hr className='subreddit-divider' />
      <h1>r/{props.name}</h1>
      <hr className='subreddit-divider' />
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
