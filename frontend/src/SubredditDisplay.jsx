import React from 'react';
import SubredditSubmissions from './SubredditSubmissions';

function SubredditDisplay(props) {
  if (!props.subredditNames) {
    return null;
  } else {
    const subredditNameList = props.subredditNames.map((subredditName) => {
      return (
        <li>
          <button
            type='button'
            className='btn btn-outline-secondary'
            onClick={() => props.removeSubreddit(subredditName)}
          >
            X
          </button>{' '}
          r/{subredditName}
        </li>
      );
    });

    const subredditList = props.subredditNames.map((subName) => {
      return (
        <div>
          <h2 className='text-center'>{subName}</h2>
          <SubredditSubmissions
            key={subName}
            name={subName}
            sortType='top'
            sortTime='year'
            amount='10'
          />
        </div>
      );
    });

    return (
      <div>
        <h4>Subscribed subreddits</h4>
        <ol>{subredditNameList}</ol>
        {subredditList}
      </div>
    );
  }
}

export default SubredditDisplay;
