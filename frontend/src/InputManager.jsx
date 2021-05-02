import React, { useState } from 'react';
import SubredditDisplay from './SubredditDisplay';

function InputManager(props) {
  const [subredditName, setSubredditName] = useState('');
  const [subNames, setSubNames] = useState([]);

  function onSubredditNameInput(event) {
    setSubredditName(event.target.value);
  }

  function invalidSubreddit() {
    alert(`Could not get data for subreddit r/${subredditName}`);
  }

  function addSubreddit() {
    if (!subNames.includes(subredditName)) {
      fetch(`/api/valid/subreddit/${subredditName}`).then((res) => {
        if (res.ok) {
          setSubNames(subNames.concat(subredditName));
        } else {
          invalidSubreddit();
        }
      });
    } else {
      alert(`Subreddit ${subredditName} is already added`);
    }
  }

  function removeSubreddit(removedSubName) {
    const newSubNames = subNames.filter(
      (subName) => subName !== removedSubName
    );
    setSubNames(newSubNames);
  }

  return (
    <div>
      <div className='row justify-content-center'>
        <div className='col-xs-2'>
          <div className='input-group'>
            <input
              id='inputSubreddit'
              className='form-control'
              type='search'
              placeholder='Enter subreddit name'
              value={subredditName}
              onChange={onSubredditNameInput}
            />
            <div className='input-group-append'>
              <button
                type='button'
                className='btn btn-primary'
                onClick={addSubreddit}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      <SubredditDisplay
        subredditNames={subNames}
        removeSubreddit={removeSubreddit}
      />
    </div>
  );
}

export default InputManager;