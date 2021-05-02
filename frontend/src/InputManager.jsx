import React, { useState } from 'react';

function InputManager(props) {
  const [subredditName, setSubredditName] = useState('');

  function onSubredditNameInput(event) {
    setSubredditName(event.target.value);
  }

  return (
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
              onClick={() => {
                props.addSubreddit(subredditName);
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputManager;
