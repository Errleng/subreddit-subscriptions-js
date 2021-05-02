import React from 'react';
import SubredditSubmissions from './SubredditSubmissions';

function Subreddit(props) {
  return (
    <div align='center'>
      <h1>r/{props.name}</h1>
      <SubredditSubmissions
        name={props.name}
        sortType='top'
        sortTime='day'
        amount='10'
      />
    </div>
  );
}

export default Subreddit;
