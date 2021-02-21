import React, { useEffect, useState } from 'react';
import SubredditSubmissions from './SubredditSubmissions';

function InputManager(props) {
  const [subredditName, setSubredditName] = useState('');
  const [subNames, setSubNames] = useState([]);

  useEffect(() => {});

  function onSubredditNameInput(event) {
    setSubredditName(event.target.value);
  }

  function addSubreddit() {
    if (!subNames.includes(subredditName)) {
      setSubNames(subNames.concat(subredditName));
    }
  }

  const subredditList = subNames.map((subredditName) => {
    return (
      <SubredditSubmissions
        key={subredditName}
        name={subredditName}
        sortType='top'
        sortTime='year'
        amount='10'
      />
    );
  });

  return (
    <div>
      <div className='row justify-content-center mt-5'>
        <div className='col-xs-2'>
          <div className='input-group mb-5 mt-5'>
            <input
              id='inputSubreddit'
              className='form-control'
              type='search'
              placeholder='Enter subreddit name'
              vale={subredditName}
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
      {subredditList}
    </div>
  );
}

export default InputManager;
