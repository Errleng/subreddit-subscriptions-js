import React, { useState } from 'react';

function InputManager(props) {
  const [subredditName, setSubredditName] = useState('');

  function onSubredditNameInput(event) {
    setSubredditName(event.target.value);
  }

  return (
    <div className='row justify-content-center'>
      <div className='col-xs-2'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.addSubreddit(subredditName);
          }}
        >
          <div className='form-group'>
            <div className='input-group'>
              <input
                className='form-control'
                type='search'
                placeholder='Enter subreddit name'
                value={subredditName}
                onChange={onSubredditNameInput}
              />
              <div className='input-group-append'>
                <button type='submit' className='btn btn-primary'>
                  Add
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InputManager;
