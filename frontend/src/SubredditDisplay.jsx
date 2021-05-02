import React, { useState } from 'react';
import Subreddit from './Subreddit';
import InputManager from './InputManager';

function SubredditDisplay(props) {
  const [subredditNames, setSubredditNames] = useState([]);
  const [subredditList, setSubredditList] = useState([]);

  function invalidSubreddit(subredditName) {
    alert(`Could not get data for subreddit r/${subredditName}`);
  }

  function addSubreddit(subredditName) {
    if (!subredditNames.includes(subredditName)) {
      fetch(`/api/valid/subreddit/${subredditName}`).then((res) => {
        if (res.ok) {
          setSubredditNames(subredditNames.concat(subredditName));
          setSubredditList(
            subredditList.concat(
              <Subreddit key={subredditName} name={subredditName} />
            )
          );
        } else {
          invalidSubreddit(subredditName);
        }
      });
    } else {
      alert(`Subreddit ${subredditName} is already added`);
    }
  }

  function removeSubreddit(removedSubName) {
    const newSubredditNames = subredditNames.filter(
      (subName) => subName !== removedSubName
    );
    setSubredditNames(newSubredditNames);
    const newSubredditList = subredditList.filter(
      (subreddit) => subreddit.props.name !== removedSubName
    );
    setSubredditList(newSubredditList);
  }

  if (subredditNames.length === 0) {
    return (
      <div>
        <InputManager addSubreddit={addSubreddit.bind(this)} />
      </div>
    );
  } else {
    const subredditNameList = subredditNames.map((subredditName) => {
      return (
        <li>
          <button
            type='button'
            className='btn btn-outline-secondary'
            onClick={() => removeSubreddit(subredditName)}
          >
            X
          </button>{' '}
          r/{subredditName}
        </li>
      );
    });

    return (
      <div>
        <InputManager addSubreddit={addSubreddit.bind(this)} />
        <div>
          <h4>Subscribed subreddits</h4>
          <ol>{subredditNameList}</ol>
          {subredditList}
        </div>
      </div>
    );
  }
}

export default SubredditDisplay;
